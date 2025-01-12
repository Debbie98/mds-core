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

import type { ServiceResponse } from '@mds-core/mds-service-helpers'
import type { AnyFunction } from '@mds-core/mds-types'

export type RpcRouteDefinition<M extends AnyFunction> = {
  request: Parameters<M>
  response: ServiceResponse<ReturnType<M>>
}

export const RpcRoute = <M extends AnyFunction>(): RpcRouteDefinition<M> => {
  return { request: {}, response: {} } as RpcRouteDefinition<M>
}

export type RpcServiceDefinition<S> = {
  [M in keyof S]: S[M] extends AnyFunction ? RpcRouteDefinition<S[M]> : never
}

export const RPC_HOST = 'http://localhost'
export const RPC_PORT = 4000
export const RPC_CONTENT_TYPE = 'application/grpc-web+json'
export const RPC_CONTEXT_KEY = 'x-rpc-context'
export const REPL_PORT = 7375 // 7375 spells REPL

export type RpcEmptyRequestContext = { [K in number | string | symbol]: never }
export type { AuthorizationContext as RpcAuthorizedRequestContext } from '@mds-core/mds-api-authorizer'
