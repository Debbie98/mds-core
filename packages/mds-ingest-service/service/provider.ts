/**
 * Copyright 2020 City of Los Angeles
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cache from '@mds-core/mds-agency-cache'
import { ProcessController, ServiceException, ServiceProvider, ServiceResult } from '@mds-core/mds-service-helpers'
import stream from '@mds-core/mds-stream'
import { Telemetry } from '@mds-core/mds-types'
import { NotFoundError } from '@mds-core/mds-utils'
import {
  EventAnnotationDomainCreateModel,
  EventDomainCreateModel,
  IngestMigrationService,
  IngestService,
  TelemetryDomainModel
} from '../@types'
import { IngestServiceLogger } from '../logger'
import { IngestRepository } from '../repository'
import {
  validateEventAnnotationDomainCreateModels,
  validateEventDomainModel,
  validateGetDevicesOptions,
  validateGetEventsWithDeviceAndTelemetryInfoOptions,
  validateGetVehicleEventsFilterParams,
  validateUUIDs
} from './validators'

export const IngestServiceProvider: ServiceProvider<IngestService & IngestMigrationService> & ProcessController = {
  start: async () => {
    await Promise.all([IngestRepository.initialize(), cache.startup(), stream.initialize()])
  },

  stop: async () => {
    await Promise.all([IngestRepository.shutdown(), cache.shutdown(), stream.shutdown()])
  },

  getDevicesUsingOptions: async options => {
    try {
      return ServiceResult(await IngestRepository.getDevicesUsingOptions(validateGetDevicesOptions(options)))
    } catch (error) {
      const exception = ServiceException('Error in getDevicesUsingOptions', error)
      IngestServiceLogger.error('getDevicesUsingOptions exception', { exception, error })
      return exception
    }
  },

  getDevicesUsingCursor: async cursor => {
    try {
      return ServiceResult(await IngestRepository.getDevicesUsingCursor(cursor))
    } catch (error) {
      const exception = ServiceException('Error in getDevicesUsingCursor', error)
      IngestServiceLogger.error('getDevicesUsingCursor exception', { exception, error })
      return exception
    }
  },

  getEventsUsingOptions: async params => {
    try {
      return ServiceResult(await IngestRepository.getEventsUsingOptions(validateGetVehicleEventsFilterParams(params)))
    } catch (error) {
      const exception = ServiceException('Error in getEvents', error)
      IngestServiceLogger.error('getEvents exception', { exception, error })
      return exception
    }
  },

  getEventsUsingCursor: async cursor => {
    try {
      return ServiceResult(await IngestRepository.getEventsUsingCursor(cursor))
    } catch (error) {
      const exception = ServiceException('Error in getEvents', error)
      IngestServiceLogger.error('getEvents exception', { exception, error })
      return exception
    }
  },

  getDevices: async device_ids => {
    try {
      return ServiceResult(await IngestRepository.getDevices(validateUUIDs(device_ids)))
    } catch (error) {
      const exception = ServiceException('Error in getDevices', error)
      IngestServiceLogger.error('getDevices exception', { exception, error })
      return exception
    }
  },

  getLatestTelemetryForDevices: async device_ids => {
    try {
      return ServiceResult(await IngestRepository.getLatestTelemetryForDevices(device_ids))
    } catch (error) {
      const exception = ServiceException('Error in getLatestTelemetryForDevices', error)
      IngestServiceLogger.error('getLatestTelemetryForDevices exception', { exception, error })
      return exception
    }
  },

  writeEvents: async (events: EventDomainCreateModel[]) => {
    try {
      // Check to see if the devices references in the events exist in the db. This is in a closure to keep the code pretty boxed off, but I didn't feel the need to make a named function elsewhere :)
      // FIXME: Move this check to the cache (once we have a cache manged by the ingest service)
      await (async () => {
        const devicesInPayload = new Set(events.map(e => e.device_id))
        const devicesInDb = await IngestRepository.getDevices([...devicesInPayload])
        if (devicesInPayload.size !== devicesInDb.length)
          throw new NotFoundError('Some device(s) in event payload not registered')
      })()

      return ServiceResult(await IngestRepository.createEvents(events.map(validateEventDomainModel)))
    } catch (error) {
      const exception = ServiceException('Error in writeEvents', error)
      IngestServiceLogger.error('writeEvents exception', { exception, error })
      return exception
    }
  },

  writeEventAnnotations: async (eventAnnotations: EventAnnotationDomainCreateModel[]) => {
    try {
      return ServiceResult(
        await IngestRepository.createEventAnnotations(validateEventAnnotationDomainCreateModels(eventAnnotations))
      )
    } catch (error) {
      const exception = ServiceException('Error in writeEventAnnotations', error)
      IngestServiceLogger.error('writeEventAnnotations exception', { exception, error })
      return exception
    }
  },

  writeMigratedDevice: async (device, migrated_from) => {
    try {
      const [model = null] = await IngestRepository.writeMigratedDevice([device], migrated_from)
      if (model) {
        const [cached, streamed] = await Promise.allSettled([cache.writeDevices([model]), stream.writeDevice(model)])
        if (cached.status === 'rejected') {
          IngestServiceLogger.warn('Error writing device to cache', { device: model, error: cached.reason })
        }
        if (streamed.status === 'rejected') {
          IngestServiceLogger.warn('Error writing device to stream', { device: model, error: streamed.reason })
        }
      }
      return ServiceResult(model)
    } catch (error) {
      const exception = ServiceException('Error in writeMigratedDevice', error)
      IngestServiceLogger.error('writeMigratedDevice exception', { exception, error })
      return exception
    }
  },

  writeMigratedVehicleEvent: async ({ telemetry, ...event }, migrated_from) => {
    // TODO: All this splitting apart and recombining of telemetry should be handled by the repository.
    // The fact that event/telemetry data is split between tables should not be something the service
    // need be aware of. The repository should split them apart for writes and join them togehter for reads.
    // Will create a ticket for this refactoring to be done separately.
    const eventTelemetryModel = (telemetry: Telemetry, options: { recorded: number }): TelemetryDomainModel => {
      const {
        charge = null,
        gps: {
          lat,
          lng,
          speed = null,
          heading = null,
          accuracy = null,
          hdop = null,
          altitude = null,
          satellites = null
        },
        stop_id = null,
        recorded = options.recorded,
        ...common
      } = telemetry
      return {
        ...common,
        stop_id,
        charge,
        recorded,
        gps: { lat, lng, speed, heading, accuracy, hdop, altitude, satellites }
      }
    }

    try {
      const [migrated = null] = await IngestRepository.writeMigratedVehicleEvent([event], migrated_from)
      if (migrated) {
        const model = { ...migrated, telemetry: eventTelemetryModel(telemetry, { recorded: event.recorded }) }
        const [cached, streamed] = await Promise.allSettled([cache.writeEvents([model]), stream.writeEvent(model)])
        if (cached.status === 'rejected') {
          IngestServiceLogger.warn('Error writing event to cache', { event: model, error: cached.reason })
        }
        if (streamed.status === 'rejected') {
          IngestServiceLogger.warn('Error writing event to stream', { event: model, error: streamed.reason })
        }
        return ServiceResult(model)
      }
      return ServiceResult(null)
    } catch (error) {
      const exception = ServiceException('Error in writeMigratedVehicleEvent', error)
      IngestServiceLogger.error('writeMigratedVehicleEvent exception', { exception, error })
      return exception
    }
  },

  writeMigratedTelemetry: async (telemetry, migrated_from) => {
    try {
      const [model = null] = await IngestRepository.writeMigratedTelemetry([telemetry], migrated_from)
      if (model) {
        const [cached, streamed] = await Promise.allSettled([
          cache.writeTelemetry([model]),
          stream.writeTelemetry([model])
        ])
        if (cached.status === 'rejected') {
          IngestServiceLogger.warn('Error writing telemetry to cache', { telemetry: model, error: cached.reason })
        }
        if (streamed.status === 'rejected') {
          IngestServiceLogger.warn('Error writing telemetry to stream', { telemetry: model, error: streamed.reason })
        }
      }
      return ServiceResult(model)
    } catch (error) {
      const exception = ServiceException('Error in writeMigratedTelemetry', error)
      IngestServiceLogger.error('writeMigratedTelemetry exception', { exception, error })
      return exception
    }
  },

  getTripEvents: async options => {
    try {
      return ServiceResult(await IngestRepository.getTripEvents(options))
    } catch (error) {
      const exception = ServiceException('Error in getTripEvents', error)
      IngestServiceLogger.error('getTripEvents exception', { exception, error })
      return exception
    }
  },

  getEventsWithDeviceAndTelemetryInfoUsingOptions: async options => {
    try {
      return ServiceResult(
        await IngestRepository.getEventsWithDeviceAndTelemetryInfoUsingOptions(
          validateGetEventsWithDeviceAndTelemetryInfoOptions(options ?? {})
        )
      )
    } catch (error) {
      const exception = ServiceException('Error in getEventsWithDeviceAndTelemetryInfoUsingOptions', error)
      IngestServiceLogger.error('getEventsWithDeviceAndTelemetryInfoUsingOptions exception', { exception, error })
      return exception
    }
  },

  getEventsWithDeviceAndTelemetryInfoUsingCursor: async cursor => {
    try {
      return ServiceResult(await IngestRepository.getEventsWithDeviceAndTelemetryInfoUsingCursor(cursor))
    } catch (error) {
      const exception = ServiceException('Error in getEventsWithDeviceAndTelemetryInfoUsingCursor', error)
      IngestServiceLogger.error('getEventsWithDeviceAndTelemetryInfoUsingCursor exception', { exception, error })
      return exception
    }
  }
}
