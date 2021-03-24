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

import { Timestamp } from '@mds-core/mds-types'
import { IdentityColumn, ModelMapper, RecordedColumn } from '@mds-core/mds-repository'
import { EventDomainCreateModel, EventDomainModel } from '../../@types'
import { EventEntityModel } from '../entities/event-entity'

type EventEntityToDomainOptions = Partial<{}>

export const EventEntityToDomain = ModelMapper<EventEntityModel, EventDomainModel, EventEntityToDomainOptions>(
  (entity, options) => {
    const { id, ...domain } = entity
    return { telemetry: null, ...domain }
  }
)

type EventEntityCreateOptions = Partial<{
  recorded: Timestamp
}>

export type EventEntityCreateModel = Omit<EventEntityModel, keyof IdentityColumn | keyof RecordedColumn>

export const EventDomainToEntityCreate = ModelMapper<
  EventDomainCreateModel,
  EventEntityCreateModel,
  EventEntityCreateOptions
>(
  (
    { event_type_reason = null, telemetry_timestamp = null, trip_id = null, service_area_id = null, ...domain },
    options
  ) => {
    const { recorded } = options ?? {}
    return { event_type_reason, telemetry_timestamp, trip_id, service_area_id, recorded, ...domain }
  }
)