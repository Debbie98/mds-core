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

import logger from '@mds-core/mds-logger'
import redis from 'redis'
import bluebird from 'bluebird'
import { Device, VehicleEvent, Telemetry, TripMetadata } from '@mds-core/mds-types'
import {
  Stream,
  StreamItem,
  ReadStreamResult,
  DEVICE_INDEX_STREAM,
  DEVICE_RAW_STREAM,
  ReadStreamOptions,
  StreamItemID,
  BadDataError
} from './types'
import { AgencyStreamKafka } from './kafka/agency-stream-kafka'
import { KafkaStreamConsumer, KafkaStreamProducer } from './kafka'

import { NatsStreamConsumer } from './nats/stream-consumer'
import { NatsStreamProducer } from './nats/stream-producer'

import { AgencyStreamNats } from './nats/agency-stream-nats'
import { mockStream } from './test-utils'

export { NatsProcessorFn } from './nats/codecs'

export { KafkaStreamConsumerOptions, KafkaStreamProducerOptions } from './kafka'
export { StreamConsumer, StreamProducer } from './stream-interface'

const { env } = process

declare module 'redis' {
  interface RedisClient {
    dbsizeAsync: () => Promise<number>
    flushdbAsync: () => Promise<'OK'>
    pingAsync: <TPong extends string = 'PONG'>(response?: TPong) => Promise<TPong>
    xaddAsync: (...args: unknown[]) => Promise<string>
    xinfoAsync: <T extends 'STREAM' | 'GROUPS'>(
      arg: T,
      stream: Stream
    ) => Promise<
      T extends 'STREAM'
        ? [
            'length',
            number,
            'radix-tree-keys',
            number,
            'radix-tree-nodes',
            number,
            'groups',
            number,
            'last-generated-id',
            string,
            'first-entry',
            StreamItem | null,
            'last-entry',
            StreamItem | null
          ]
        : ['name', string, 'consumers', number, 'pending', number, 'last-delivered-id', string][]
    >
    xreadAsync: (...args: unknown[]) => Promise<ReadStreamResult[]>
    xgroupAsync: (...args: unknown[]) => Promise<'OK'>
    xreadgroupAsync: (...args: unknown[]) => Promise<ReadStreamResult[]>
  }

  interface Multi {
    xadd: (...args: unknown[]) => string
    execAsync: () => Promise<object[]>
  }
}

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const { now } = Date

let cachedClient: redis.RedisClient | null = null

const STREAM_MAXLEN: { [S in Stream]: number } = {
  'device:index': 10_000,
  'device:raw': 1_000_000
}

async function getClient() {
  if (!cachedClient) {
    const { REDIS_HOST, REDIS_PORT, REDIS_PASS } = process.env
    const { host = 'localhost', port = 6379, password } = { host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASS }
    if (!REDIS_PORT) {
      logger.info(`no redis port found, falling back to ${port}`)
    }
    if (!REDIS_HOST) {
      logger.info(`no redis host found, falling back to ${host}`)
    }

    logger.info(`connecting to redis on ${host}:${port}`)
    cachedClient = redis.createClient(Number(port), host, { password })
    cachedClient.on('error', async err => {
      logger.error(`redis error ${err}`)
    })
    await cachedClient.dbsizeAsync().then(size => logger.info(`redis has ${size} keys`))
  }
  return cachedClient
}

async function initialize() {
  if (process.env.KAFKA_HOST) {
    await AgencyStreamKafka.initialize()
  }
  if (process.env.NATS) {
    await AgencyStreamNats.initialize()
  }
  await getClient()
}

async function reset() {
  const client = await getClient()
  await client.flushdbAsync().then(() => logger.info('redis flushed'))
}

async function startup() {
  await getClient()
}

async function shutdown() {
  if (cachedClient) {
    await cachedClient.quit()
    cachedClient = null
  }
  await AgencyStreamKafka.shutdown()
  await AgencyStreamNats.shutdown()
}

async function writeStream(stream: Stream, field: string, value: unknown) {
  const client = await getClient()
  return client.xaddAsync(stream, 'MAXLEN', '~', STREAM_MAXLEN[stream], '*', field, JSON.stringify(value))
}

async function writeStreamBatch(stream: Stream, field: string, values: unknown[]) {
  const client = await getClient()
  const batch = client.batch()
  values.forEach(value => batch.xadd(stream, 'MAXLEN', '~', STREAM_MAXLEN[stream], '*', field, JSON.stringify(value)))
  await batch.execAsync()
}

// put basics of vehicle in the cache
async function writeDevice(device: Device) {
  if (env.NATS) {
    try {
      await AgencyStreamNats.writeDevice(device)
    } catch (err) {
      logger.error('Failed to write device to NATS', err)
      throw err
    }
  }
  if (env.KAFKA_HOST) {
    try {
      await AgencyStreamKafka.writeDevice(device)
    } catch (err) {
      logger.error('Failed to write device to Kafka', err)
      throw err
    }
  }
  return writeStream(DEVICE_INDEX_STREAM, 'data', device)
}

async function writeEvent(event: VehicleEvent) {
  if (env.NATS) {
    await AgencyStreamNats.writeEvent(event)
  }
  if (env.KAFKA_HOST) {
    await AgencyStreamKafka.writeEvent(event)
  }
  return writeStream(DEVICE_RAW_STREAM, 'event', event)
}

async function writeEventError(error: BadDataError) {
  if (env.NATS) {
    await AgencyStreamNats.writeEventError(error)
  }
  if (env.KAFKA_HOST) {
    await AgencyStreamKafka.writeEventError(error)
  }
  return writeStream(DEVICE_RAW_STREAM, 'event', error)
}

// put latest locations in the cache
async function writeTelemetry(telemetry: Telemetry[]) {
  if (env.NATS) {
    try {
      await AgencyStreamNats.writeTelemetry(telemetry)
    } catch (err) {
      logger.error('Failed to write telemetry to NATS', err)
      throw err
    }
  }
  if (env.KAFKA_HOST) {
    try {
      await AgencyStreamKafka.writeTelemetry(telemetry)
    } catch (err) {
      logger.error('Failed to write telemetry to Kafka', err)
      throw err
    }
  }
  const start = now()
  await writeStreamBatch(DEVICE_RAW_STREAM, 'telemetry', telemetry)
  const delta = now() - start
  if (delta > 200) {
    logger.info('mds-stream::writeTelemetry', { pointsInserted: telemetry.length, executionTime: delta })
  }
}

const writeTripMetadata = async (metadata: TripMetadata) => {
  return Promise.all([
    ...(env.NATS ? [AgencyStreamNats.writeTripMetadata(metadata)] : []),
    ...(env.KAFKA_HOST ? [AgencyStreamKafka.writeTripMetadata(metadata)] : [])
  ])
}

async function readStream(
  stream: Stream,
  id: StreamItemID,
  { count, block }: ReadStreamOptions
): Promise<ReadStreamResult> {
  const client = await getClient()

  const results = await client.xreadAsync([
    ...(typeof block === 'number' ? ['BLOCK', block] : []),
    ...(typeof count === 'number' ? ['COUNT', count] : []),
    'STREAMS',
    stream,
    id || '$'
  ])

  if (results) {
    const [result] = results
    return result
  }

  return [stream, []]
}

async function createStreamGroup(stream: Stream, group: string) {
  const client = await getClient()
  return client.xgroupAsync('CREATE', stream, `${stream}::${group}`, 0, 'MKSTREAM')
}

async function readStreamGroup(
  stream: Stream,
  group: string,
  consumer: string,
  id: StreamItemID,
  { count, block, noack }: ReadStreamOptions
): Promise<ReadStreamResult> {
  const client = await getClient()

  const results = await client.xreadgroupAsync(
    'GROUP',
    `${stream}::${group}`,
    consumer,
    ...[
      ...(typeof block === 'number' ? ['BLOCK', block] : []),
      ...(typeof count === 'number' ? ['COUNT', count] : []),
      ...(noack ? ['NOACK'] : []),
      'STREAMS',
      stream,
      id || '>'
    ]
  )

  if (results) {
    const [result] = results
    return result
  }

  return [stream, []]
}

async function getStreamInfo(stream: Stream) {
  const client = await getClient()
  try {
    const [
      ,
      length,
      ,
      radixTreeKeys,
      ,
      radixTreeNodes,
      ,
      groups,
      ,
      lastGeneratedId,
      ,
      firstEntry,
      ,
      lastEntry
    ] = await client.xinfoAsync('STREAM', stream)
    return { length, radixTreeKeys, radixTreeNodes, groups, lastGeneratedId, firstEntry, lastEntry }
  } catch (err) {
    return null
  }
}

async function health() {
  if (env.SINK) {
    return Promise.resolve({ using: 'cloudevents-emitter', status: true, stats: {} })
  }
  const client = await getClient()
  const status = await client.pingAsync('connected')
  return { using: 'redis', status }
}

export default {
  createStreamGroup,
  getStreamInfo,
  health,
  initialize,
  readStream,
  readStreamGroup,
  reset,
  shutdown,
  startup,
  writeDevice,
  writeEvent,
  writeEventError,
  writeStream,
  writeStreamBatch,
  writeTelemetry,
  KafkaStreamConsumer,
  KafkaStreamProducer,
  NatsStreamConsumer,
  NatsStreamProducer,
  mockStream,
  writeTripMetadata
}
