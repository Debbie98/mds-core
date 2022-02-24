/**
 * Copyright 2019 City of Los Angeles
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

import { pluralize, tail } from '@mds-core/mds-utils'
import { bool, cleanEnv } from 'envalid'
import { Connection, ConnectionOptions } from 'typeorm'
import { ConnectionManager, ConnectionManagerCliOptions, ConnectionManagerOptions, ConnectionMode } from './connection'
import { RepositoryLogger } from './logger'
import { RepositoryMigrations } from './migrations'

export type RepositoryOptions = Pick<ConnectionManagerOptions, 'entities' | 'migrations'>

export abstract class BaseRepository<TConnectionMode extends ConnectionMode> {
  private readonly manager: ConnectionManager<TConnectionMode>

  protected ormconfig = (mode: TConnectionMode, options?: ConnectionManagerCliOptions): ConnectionOptions =>
    this.manager.ormconfig(mode, options)

  protected connect = async (mode: TConnectionMode): Promise<Omit<Connection, 'connect' | 'close'>> =>
    this.manager.connect(mode)

  protected disconnect = async (mode: TConnectionMode): Promise<void> => this.manager.disconnect(mode)

  public abstract initialize: () => Promise<void>

  public abstract shutdown: () => Promise<void>

  constructor(public readonly name: string, { entities, migrations }: Required<RepositoryOptions>) {
    const migrationsTableName = `${name}-migrations`
    const metadataTableName = `${name}-migration-metadata`
    this.manager = new ConnectionManager(name, {
      migrationsTableName,
      metadataTableName,
      entities,
      migrations: migrations.length === 0 ? [] : RepositoryMigrations(migrationsTableName).concat(migrations)
    })
  }
}

export abstract class ReadOnlyRepository extends BaseRepository<'ro'> {
  public initialize = async (): Promise<void> => {
    RepositoryLogger.info(`Initializing R/O repository: ${this.name}`)
    await this.connect('ro')
  }

  public shutdown = async (): Promise<void> => {
    RepositoryLogger.info(`Terminating R/O repository: ${this.name}`)
    await this.disconnect('ro')
  }

  constructor(name: string, { entities = [] }: Omit<RepositoryOptions, 'migrations'> = {}) {
    super(name, { entities, migrations: [] })
  }
}

export abstract class ReadWriteRepository extends BaseRepository<'ro' | 'rw'> {
  public runAllMigrations = async (): Promise<void> => {
    const connection = await this.connect('rw')
    const {
      options: { migrationsTableName }
    } = connection
    if (migrationsTableName) {
      if (connection.migrations.length > 0) {
        const migrations = await connection.runMigrations({ transaction: 'all' })
        RepositoryLogger.info(
          `Ran ${migrations.length || 'no'} ${pluralize(
            migrations.length,
            'migration',
            'migrations'
          )} (${migrationsTableName})${
            migrations.length ? `: ${migrations.map(migration => migration.name).join(', ')}` : ''
          }`
        )
        RepositoryLogger.info(`Schema version (${migrationsTableName}): ${tail(connection.migrations).name}`)
      } else {
        RepositoryLogger.info(`No migrations defined (${migrationsTableName})`)
      }
    }
  }

  public revertAllMigrations = async (): Promise<void> => {
    const connection = await this.connect('rw')
    const {
      options: { migrationsTableName }
    } = connection
    if (migrationsTableName) {
      const { migrations } = connection
      await migrations.reduce(p => p.then(() => connection.undoLastMigration()), Promise.resolve())
      RepositoryLogger.info(
        `Reverted ${migrations.length || 'no'} ${pluralize(
          migrations.length,
          'migration',
          'migrations'
        )} (${migrationsTableName})${
          migrations.length ? `: ${migrations.map(migration => migration.name).join(', ')}` : ''
        }`
      )
    }
  }

  public initialize = async (): Promise<void> => {
    RepositoryLogger.info(`Initializing R/W repository: ${this.name}`)
    await Promise.all([this.connect('ro'), this.connect('rw')])

    // Enable migrations by default
    const { PG_MIGRATIONS } = cleanEnv(process.env, { PG_MIGRATIONS: bool({ default: true }) })
    if (PG_MIGRATIONS) {
      await this.runAllMigrations()
    }
  }

  public shutdown = async (): Promise<void> => {
    RepositoryLogger.info(`Terminating R/W repository: ${this.name}`)
    await Promise.all([this.disconnect('ro'), this.disconnect('rw')])
  }

  public cli = (options?: ConnectionManagerCliOptions) => this.ormconfig('rw', options)

  protected asChunksForInsert = <TEntity>(entities: TEntity[], size = 4_000) => {
    const chunks =
      entities.length > size
        ? entities.reduce<Array<Array<TEntity>>>((reduced, t, index) => {
            const chunk = Math.floor(index / size)
            if (!reduced[chunk]) {
              reduced.push([])
            }
            reduced[chunk].push(t)
            return reduced
          }, [])
        : [entities]

    if (chunks.length > 1) {
      RepositoryLogger.info(`Splitting ${entities.length} records into ${chunks.length} chunks for insert`)
    }
    return chunks
  }

  constructor(name: string, { entities = [], migrations = [] }: RepositoryOptions = {}) {
    super(name, { entities, migrations })
  }
}
