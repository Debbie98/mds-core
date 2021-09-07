/**
 * Copyright 2021 City of Los Angeles
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
import { DeviceDomainModel, IngestServiceClient, MigratedEntityModel } from '@mds-core/mds-ingest-service'
import logger from '@mds-core/mds-logger'
import { IdentityColumn, RecordedColumn } from '@mds-core/mds-repository'
import {
  DeadLetterSink,
  KafkaSink,
  KafkaSource,
  StreamProcessor,
  StreamProcessorController,
  StreamSink,
  StreamSource
} from '@mds-core/mds-stream-processor'
import {
  convert_v0_4_1_device_to_1_0_0,
  convert_v0_4_1_vehicle_event_to_v1_0_0,
  convert_v1_0_0_device_to_1_1_0,
  convert_v1_0_0_vehicle_event_to_v1_1_0,
  Device,
  Device_v0_4_1,
  Nullable,
  Telemetry,
  UUID,
  VehicleEvent,
  VehicleEvent_v0_4_1
} from '@mds-core/mds-types'
import { asArray, ServerError } from '@mds-core/mds-utils'
import { cleanEnv, num, str } from 'envalid'

const { SOURCE_TENANT_ID, TENANT_ID, MIGRATION_BLOCK_SIZE_LIMIT } = cleanEnv(process.env, {
  SOURCE_TENANT_ID: str(),
  TENANT_ID: str(),
  MIGRATION_BLOCK_SIZE_LIMIT: num({ default: 250 })
})

type MigrationEntityType = 'device' | 'event' | 'telemetry'

const MigrationSourceTopic = (entityType: MigrationEntityType) => `${SOURCE_TENANT_ID}.${entityType}`

const MigrationDataSource: <MigrationSourceEntity>(entity: MigrationEntityType) => StreamSource<MigrationSourceEntity> =
  entity => {
    const topic = MigrationSourceTopic(entity)
    return KafkaSource(topic, { groupId: `${topic}.ingest-migration-processor` })
  }

const MigrationErrorTopic = (entityType: MigrationEntityType) => `${TENANT_ID}.${entityType}.error`

const MigrationErrorSink: <MigrationSourceEntity>(
  entity: MigrationEntityType
) => DeadLetterSink<MigrationSourceEntity> = entity => {
  const topic = MigrationErrorTopic(entity)
  return KafkaSink(topic, {
    clientId: `${topic}.ingest-migration-processor`
  })
}

const MigratedFrom = (entityType: MigrationEntityType, migrated_from_id: number) => ({
  migrated_from_source: MigrationSourceTopic(entityType),
  migrated_from_version: '0.4.1',
  migrated_from_id
})

interface MigratedDevice {
  device: Device & Required<RecordedColumn>
  migrated_from: MigratedEntityModel
}

const IngestServiceMigratedDeviceSink = (): StreamSink<MigratedDevice> => () => {
  const topic = MigrationSourceTopic('device')
  return {
    initialize: async () => undefined,
    write: async message => {
      try {
        const [{ device, migrated_from }] = asArray(message)
        await IngestServiceClient.writeMigratedDevice(device, migrated_from)
      } catch (error) {
        logger.error(`Error migrating device`, { topic, message })
        throw error
      }
    },
    shutdown: async () => undefined
  }
}

const DevicesMigrationProcessor = StreamProcessor<Device_v0_4_1 & IdentityColumn, MigratedDevice>(
  MigrationDataSource('device'),
  async ({ id, ...device }) => ({
    device: convert_v1_0_0_device_to_1_1_0(convert_v0_4_1_device_to_1_0_0(device)),
    migrated_from: MigratedFrom('device', id)
  }),
  [IngestServiceMigratedDeviceSink()],
  [MigrationErrorSink('device')]
)

interface MigratedVehicleEvent {
  event: VehicleEvent & Required<RecordedColumn>
  migrated_from: MigratedEntityModel
}

const IngestServiceMigratedVehicleEventSink = (): StreamSink<MigratedVehicleEvent> => () => {
  const topic = MigrationSourceTopic('event')
  return {
    initialize: async () => undefined,
    write: async message => {
      try {
        const [{ event, migrated_from }] = asArray(message)
        await IngestServiceClient.writeMigratedVehicleEvent(event, migrated_from)
      } catch (error) {
        logger.error(`Error migrating event`, { topic, message })
        throw error
      }
    },
    shutdown: async () => undefined
  }
}

const EventsMigrationProcessor = StreamProcessor<
  VehicleEvent_v0_4_1 & { service_area_id: Nullable<UUID> } & IdentityColumn,
  MigratedVehicleEvent
>(
  MigrationDataSource('event'),
  async ({ id, service_area_id, ...event }) =>
    event.event_type === 'register'
      ? null
      : {
          event: convert_v1_0_0_vehicle_event_to_v1_1_0(convert_v0_4_1_vehicle_event_to_v1_0_0(event)),
          migrated_from: MigratedFrom('event', id)
        },
  [IngestServiceMigratedVehicleEventSink()],
  [MigrationErrorSink('event')]
)

interface MigratedTelemetry {
  telemetry: Telemetry & Required<RecordedColumn>
  migrated_from: MigratedEntityModel
}

const IngestServiceMigratedTelemetrySink = (): StreamSink<MigratedTelemetry> => () => {
  const topic = MigrationSourceTopic('telemetry')
  return {
    initialize: async () => undefined,
    write: async message => {
      try {
        const [{ telemetry, migrated_from }] = asArray(message)
        await IngestServiceClient.writeMigratedTelemetry(telemetry, migrated_from)
      } catch (error) {
        logger.error(`Error migrating telemetry`, { topic, message })
        throw error
      }
    },
    shutdown: async () => undefined
  }
}

const TelemetryMigrationProcessor = StreamProcessor<
  Telemetry & IdentityColumn & Required<RecordedColumn>,
  MigratedTelemetry
>(
  MigrationDataSource('telemetry'),

  async ({ id, ...telemetry }) => ({
    telemetry,
    migrated_from: MigratedFrom('telemetry', id)
  }),
  [IngestServiceMigratedTelemetrySink()],
  [MigrationErrorSink('telemetry')]
)

const cacheDevicesEventsAndTelemetry = async (devices: DeviceDomainModel[]) => {
  // Cache the devices
  await Promise.all(devices.map(cache.writeDevice))
  const device_ids = devices.map(device => device.device_id)

  // Cache the latest event for each device
  const { events, cursor } = await IngestServiceClient.getEventsUsingOptions({
    grouping_type: 'latest_per_vehicle',
    device_ids,
    limit: device_ids.length
  })
  if (cursor.next !== null) {
    throw new ServerError('More than one event returned for a device')
  }
  await Promise.all(events.map(cache.writeEvent))

  // Cache the latest telemetry for each device
  const telemetry = await IngestServiceClient.getLatestTelemetryForDevices(device_ids)
  if (telemetry.length > devices.length) {
    throw new ServerError('More than one telemetry returned for a device')
  }
  await cache.writeTelemetry(telemetry, { quiet: true })
  return { devices: devices.length, events: events.length, telemetry: telemetry.length }
}

const initializeCacheForMigration = async () => {
  logger.info('Cache initialization commencing')

  try {
    await cache.startup()
    const {
      devices,
      cursor: { next }
    } = await IngestServiceClient.getDevicesUsingOptions({
      limit: MIGRATION_BLOCK_SIZE_LIMIT
    })

    const totals = await cacheDevicesEventsAndTelemetry(devices)

    let cursor = next

    while (cursor !== null) {
      logger.info('Cache initialization progress', totals)
      const {
        devices,
        cursor: { next }
      } = await IngestServiceClient.getDevicesUsingCursor(cursor)
      const updates = await cacheDevicesEventsAndTelemetry(devices)
      totals.devices += updates.devices
      totals.events += updates.events
      totals.telemetry += updates.telemetry
      cursor = next
    }

    logger.info('Cache initialization complete', totals)
  } catch (error) {
    logger.error('Cache initialization failed', { error })
    throw error
  } finally {
    await cache.shutdown()
  }
}

export const IngestMigrationProcessor = (): StreamProcessorController => {
  const processors = [DevicesMigrationProcessor, EventsMigrationProcessor, TelemetryMigrationProcessor]
  return {
    start: async () => {
      await initializeCacheForMigration()
      await Promise.all(processors.map(processor => processor.start()))
    },
    stop: async () => {
      await Promise.all(processors.map(processor => processor.stop()))
    }
  }
}
