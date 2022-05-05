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

import type { RedisKey } from 'ioredis'
export type { RedisKey } from 'ioredis'
export type OrderedFields = { [key: string]: number }

declare module 'ioredis' {
  interface Redis {
    geoadd: (key: RedisKey, longitude: number, latitude: number, member: RedisKey) => Promise<string[]>
    georadius: (key: RedisKey, longitude: number, latitude: number, radius: number, unit: string) => Promise<string[]>
  }
}
