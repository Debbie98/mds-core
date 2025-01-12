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

import type { AccessTokenScopeValidator } from '@mds-core/mds-api-server'
import { checkAccess } from '@mds-core/mds-api-server'
import { pathPrefix } from '@mds-core/mds-utils'
import type express from 'express'
import type { JurisdictionApiAccessTokenScopes } from './@types'
import {
  CreateJurisdictionHandler,
  DeleteJurisdictionHandler,
  GetJurisdictionHandler,
  GetJurisdictionsHandler,
  UpdateJurisdictionHandler
} from './handlers'
import { JurisdictionApiVersionMiddleware } from './middleware'

const checkJurisdictionApiAccess = (validator: AccessTokenScopeValidator<JurisdictionApiAccessTokenScopes>) =>
  checkAccess(validator)

export const api = (app: express.Express): express.Express =>
  app
    .use(JurisdictionApiVersionMiddleware)
    .get(
      pathPrefix('/jurisdictions'),
      checkJurisdictionApiAccess(
        scopes => scopes.includes('jurisdictions:read') || scopes.includes('jurisdictions:read:claim')
      ),
      GetJurisdictionsHandler
    )
    .get(
      pathPrefix('/jurisdictions/:jurisdiction_id'),
      checkJurisdictionApiAccess(
        scopes => scopes.includes('jurisdictions:read') || scopes.includes('jurisdictions:read:claim')
      ),
      GetJurisdictionHandler
    )
    .post(
      pathPrefix('/jurisdictions'),
      checkJurisdictionApiAccess(scopes => scopes.includes('jurisdictions:write')),
      CreateJurisdictionHandler
    )
    .put(
      pathPrefix('/jurisdictions/:jurisdiction_id'),
      checkJurisdictionApiAccess(scopes => scopes.includes('jurisdictions:write')),
      UpdateJurisdictionHandler
    )
    .delete(
      pathPrefix('/jurisdictions/:jurisdiction_id'),
      checkJurisdictionApiAccess(scopes => scopes.includes('jurisdictions:write')),
      DeleteJurisdictionHandler
    )
