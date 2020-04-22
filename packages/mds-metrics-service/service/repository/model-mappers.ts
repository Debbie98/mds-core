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

import { Timestamp } from '@mds-core/mds-types'
import { CreateIdentityEntityModel } from '@mds-core/mds-repository'
import { MetricEntityModel } from './entities/metric-entity'
import { MetricDomainModel } from '../../@types'

const MetricEntityModelMapper = (models: MetricEntityModel[]) => ({
  toDomainModel: (): MetricDomainModel[] => {
    return models.map(model => {
      const { id, recorded, ...domain } = model
      return domain
    })
  }
})

interface MetricDomainToEntityModelMapperOptions {
  recorded: Timestamp
}

const MetricDomainModelMapper = (models: MetricDomainModel[]) => ({
  toEntityModel: (options: MetricDomainToEntityModelMapperOptions): CreateIdentityEntityModel<MetricEntityModel>[] => {
    const { recorded } = options
    return models.map(model => {
      const entity = { ...model, recorded }
      return entity
    })
  }
})

export const MetricMapper = {
  fromDomainModel: MetricDomainModelMapper,
  fromEntityModel: MetricEntityModelMapper
}