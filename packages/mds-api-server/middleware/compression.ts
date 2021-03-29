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

import type { RequestHandler } from 'express'
import type { CompressionOptions } from 'compression'
import compression from 'compression'

export type CompressionMiddlewareOptions = Partial<CompressionOptions>

export const CompressionMiddleware = (options: CompressionMiddlewareOptions = {}): RequestHandler =>
  compression(options)
