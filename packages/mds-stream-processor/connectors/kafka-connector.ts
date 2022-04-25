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

import type { HealthStatus } from '@mds-core/mds-api-server'
import type { KafkaStreamConsumerOptions, KafkaStreamProducerOptions } from '@mds-core/mds-stream'
import stream from '@mds-core/mds-stream'
import type { SingleOrArray } from '@mds-core/mds-types'
import { ParseError } from '@mds-core/mds-utils'
import type { StreamSink, StreamSource } from '../@types'
import { StreamProcessorLogger } from '../logger'

/** Counts the number of messages consumed so far, logs & resets once it hits 100 */
class Counter {
  private count = 0

  public get() {
    return this.count
  }

  public increment() {
    if (this.count === 100) {
      StreamProcessorLogger.info(
        'Processed 100 messages, set the env var DEBUG=mds:mds-stream-processor to log eachMessage details.'
      )
      this.count = 0
    } else {
      this.count++
    }
  }
}

export const KafkaSource =
  <TMessage>(
    topics: SingleOrArray<string>,
    {
      messageLogger,
      healthStatus,
      ...options
    }: Partial<KafkaStreamConsumerOptions & { messageLogger: (message: TMessage) => string | undefined }> & {
      healthStatus: HealthStatus
    }
  ): StreamSource<TMessage> =>
  processor => {
    const messageCounter = new Counter()
    StreamProcessorLogger.info('Creating KafkaSource', { topics, options })
    return stream.KafkaStreamConsumer(
      topics,
      async payload => {
        const {
          topic,
          message: { offset, value }
        } = payload
        if (value) {
          const message: TMessage | ParseError = (() => {
            try {
              return JSON.parse(value.toString())
            } catch (err) {
              return new ParseError('JSON.parse() failure', value)
            }
          })()
          StreamProcessorLogger.debug(`Processing ${topic}/${offset}`, {
            message: message instanceof ParseError ? message : (messageLogger && messageLogger(message)) ?? message
          })

          await processor(message)

          return messageCounter.increment()
        }
      },
      healthStatus,
      options
    )
  }

export const KafkaSink =
  <TMessage>(topic: string, options?: Partial<KafkaStreamProducerOptions<TMessage>>): StreamSink<TMessage> =>
  () => {
    StreamProcessorLogger.info('Creating KafkaSink', { topic, options })
    return stream.KafkaStreamProducer(topic, options)
  }
