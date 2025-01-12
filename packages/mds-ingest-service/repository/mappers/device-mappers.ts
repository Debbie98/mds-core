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

import type { IdentityColumn, RecordedColumn } from '@mds-core/mds-repository'
import { ModelMapper } from '@mds-core/mds-repository'
import type { Timestamp } from '@mds-core/mds-types'
import type { DeviceDomainCreateModel, DeviceDomainModel } from '../../@types'
import type { DeviceEntityModel } from '../entities/device-entity'
import type { MigratedEntityModel } from '../mixins/migrated-entity'

type DeviceEntityToDomainOptions = Partial<{}>

export const DeviceEntityToDomain = ModelMapper<DeviceEntityModel, DeviceDomainModel, DeviceEntityToDomainOptions>(
  (entity, options) => {
    const { id, migrated_from_source, migrated_from_version, migrated_from_id, ...domain } = entity
    return { ...domain }
  }
)

export const DeviceEntityToDomainWithIdentityColumn = ModelMapper<
  DeviceEntityModel,
  DeviceDomainModel & IdentityColumn,
  DeviceEntityToDomainOptions
>((entity, options) => {
  const { id } = entity
  return { ...DeviceEntityToDomain.map(entity, options), id }
})

type DeviceEntityCreateOptions = Partial<{
  recorded: Timestamp
}>

export type DeviceEntityCreateModel = Omit<
  DeviceEntityModel,
  keyof IdentityColumn | keyof RecordedColumn | keyof MigratedEntityModel
>

export const DeviceDomainToEntityCreate = ModelMapper<
  DeviceDomainCreateModel,
  DeviceEntityCreateModel,
  DeviceEntityCreateOptions
>(({ year = null, mfgr = null, model = null, accessibility_options = null, ...domain }, options) => {
  const { recorded } = options ?? {}
  return {
    year,
    mfgr,
    model,
    accessibility_options,
    recorded,
    ...domain
  }
})
