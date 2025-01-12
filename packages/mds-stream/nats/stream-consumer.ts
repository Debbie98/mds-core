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

import type { Nullable, SingleOrArray } from '@mds-core/mds-types'
import type { NatsConnection, SubscriptionOptions } from 'nats'
import type { StreamConsumer } from '../stream-interface'
import type { NatsProcessorFn } from './codecs'
import { createStreamConsumer, disconnectClient } from './helpers'

export const NatsStreamConsumer = (
  topics: SingleOrArray<string>,
  eachMessage: NatsProcessorFn,
  options?: Partial<SubscriptionOptions>
): StreamConsumer => {
  let consumer: Nullable<NatsConnection> = null
  return {
    initialize: async () => {
      if (!consumer) {
        consumer = await createStreamConsumer(topics, eachMessage, options)
      }
    },
    shutdown: async () => {
      if (consumer) await disconnectClient(consumer)
      consumer = null
    }
  }
}
