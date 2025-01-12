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

import { BigintTransformer, DesignType, IdentityColumn, RecordedColumn } from '@mds-core/mds-repository'
import { Timestamp, UUID } from '@mds-core/mds-types'
import { Column, Entity, Index } from 'typeorm'

@Index(['provider_id', 'h3_08', 'timestamp'])
@Index(['provider_id', 'h3_09', 'timestamp'])
@Index(['provider_id', 'h3_10', 'timestamp'])
@Index(['provider_id', 'h3_11', 'timestamp'])
@Index(['provider_id', 'h3_12', 'timestamp'])
@Index(['provider_id', 'h3_13', 'timestamp'])
@Entity('telemetry_annotations')
export class TelemetryAnnotationEntity extends IdentityColumn(RecordedColumn(class {})) {
  @Column('uuid', { primary: true })
  device_id: UUID

  @Column('uuid')
  @Index()
  provider_id: UUID

  @Column('bigint', { transformer: BigintTransformer, primary: true })
  @Index()
  @DesignType(Number)
  timestamp: Timestamp

  @Index()
  @Column('varchar', { length: 15 })
  h3_08: string

  @Index()
  @Column('varchar', { length: 15 })
  h3_09: string

  @Index()
  @Column('varchar', { length: 15 })
  h3_10: string

  @Index()
  @Column('varchar', { length: 15 })
  h3_11: string

  @Index()
  @Column('varchar', { length: 15 })
  h3_12: string

  @Index()
  @Column('varchar', { length: 15 })
  h3_13: string

  @Index()
  @Column('bigint', { transformer: BigintTransformer })
  telemetry_row_id: number

  @Column('varchar', { array: true, length: 36 })
  geography_ids: UUID[]
}

export type TelemetryAnnotationEntityModel = TelemetryAnnotationEntity
