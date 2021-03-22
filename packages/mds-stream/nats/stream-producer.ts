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

import { Client } from 'ts-nats'
import { isArray } from 'util'
import { Nullable } from '@mds-core/mds-types'
import { StreamProducer } from '../stream-interface'
import { createStreamProducer, disconnectClient } from './helpers'

export const NatsStreamProducer = <TMessage>(topic: string): StreamProducer<TMessage> => {
  let producer: Nullable<Client> = null
  return {
    initialize: async () => {
      if (!producer) {
        producer = await createStreamProducer()
      }
    },
    write: async (message: TMessage[] | TMessage) => {
      const messages = (isArray(message) ? message : [message]).map(msg => {
        return JSON.stringify(msg)
      })

      await Promise.all(messages.map(msg => producer?.publish(topic, msg)))
    },
    shutdown: async () => {
      if (producer) await disconnectClient(producer)
      producer = null
    }
  }
}
