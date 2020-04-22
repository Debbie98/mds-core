/*
    Copyright 2019-2020 City of Los Angeles.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
 */

import { ServiceResponse } from '@mds-core/mds-service-helpers'
import { UUID, Timestamp } from '@mds-core/mds-types'
import { DeepPartial } from 'typeorm'

export interface JurisdictionDomainModel {
  jurisdiction_id: UUID
  agency_key: string
  agency_name: string
  geography_id: UUID
  timestamp: Timestamp
}

export type CreateJurisdictionType = Partial<Pick<JurisdictionDomainModel, 'jurisdiction_id' | 'timestamp'>> &
  Pick<JurisdictionDomainModel, 'agency_key' | 'agency_name' | 'geography_id'>

export type UpdateJurisdictionType = DeepPartial<JurisdictionDomainModel>

export interface GetJurisdictionsOptions {
  effective: Timestamp
}

export interface JurisdictionServiceInterface {
  createJurisdiction: (jurisdiction: CreateJurisdictionType) => Promise<ServiceResponse<JurisdictionDomainModel>>
  createJurisdictions: (jurisdictions: CreateJurisdictionType[]) => Promise<ServiceResponse<JurisdictionDomainModel[]>>
  updateJurisdiction: (
    jurisdiction_id: UUID,
    update: UpdateJurisdictionType
  ) => Promise<ServiceResponse<JurisdictionDomainModel>>
  deleteJurisdiction: (
    jurisdiction_id: UUID
  ) => Promise<ServiceResponse<Pick<JurisdictionDomainModel, 'jurisdiction_id'>>>
  getJurisdictions: (options?: Partial<GetJurisdictionsOptions>) => Promise<ServiceResponse<JurisdictionDomainModel[]>>
  getJurisdiction: (
    jurisdiction_id: UUID,
    options?: Partial<GetJurisdictionsOptions>
  ) => Promise<ServiceResponse<JurisdictionDomainModel>>
}