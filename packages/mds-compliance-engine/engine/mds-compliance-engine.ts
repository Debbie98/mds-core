/*
    Copyright 2019 City of Los Angeles.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
 */

import {
  Device,
  Geography,
  Policy,
  VehicleEvent,
  DAY_OF_WEEK,
  TIME_FORMAT,
  DAYS_OF_WEEK,
  UUID,
  CountRule,
  Rule,
  SpeedRule,
  TimeRule,
  Telemetry,
  RULE_TYPES
} from '@mds-core/mds-types'

import { MatchedVehicleInformation, ComplianceResponseDomainModel } from '@mds-core/mds-compliance-service'
import {
  pointInShape,
  getPolygon,
  isInStatesOrEvents,
  now,
  isDefined,
  RULE_UNIT_MAP,
  UnsupportedTypeError,
  uuid
} from '@mds-core/mds-utils'
import moment from 'moment-timezone'
import { readGeographies } from '@mds-core/mds-db/geographies'
import { VehicleEventWithTelemetry } from 'packages/mds-compliance/types'
import {
  getProviderIDs,
  getRecentEvents,
  isInVehicleTypes,
  isPolicyActive,
  isRuleActive,
  getComplianceInputs
} from './helpers'

import { processCountPolicy } from './count_processors'
import { processSpeedPolicy } from './speed_processors'
import { processTimePolicy } from './time_processors'
import { ComplianceResult, NewComplianceResponse } from '../@types'

function getProcessorType(rule_type: string) {
  switch (rule_type) {
    case RULE_TYPES.count: {
      return processCountPolicy
    }
    case RULE_TYPES.speed: {
      return processSpeedPolicy
    }
    case RULE_TYPES.time: {
      return processTimePolicy
    }
    default: {
      throw new UnsupportedTypeError(`Policy type ${rule_type} unsupported`)
    }
  }
}

export async function createComplianceResponse(
  policy: Policy,
  provider_id: UUID,
  geographies: Geography[],
  processorFunction: (
    p: Policy,
    events: VehicleEventWithTelemetry[],
    geos: Geography[],
    devicesToCheck: { [d: string]: Device }
  ) => ComplianceResult | undefined
) {
  const { filteredEvents, deviceMap } = await getComplianceInputs(provider_id)
  const compliance_as_of = now()
  const complianceResult = processorFunction(
    policy,
    filteredEvents as VehicleEventWithTelemetry,
    geographies,
    deviceMap
  )
  if (complianceResult) {
    const complianceResponse: NewComplianceResponse = {
      compliance_as_of,
      compliance_id: uuid(),
      excess_vehicles_count: complianceResult.excess_vehicles_count,
      total_violations: complianceResult.total_violations,
      policy: {
        name: policy.name,
        policy_id: policy.policy_id
      },
      provider_id,
      vehicles_found: complianceResult.vehicles_found
    }
    return complianceResponse
  }
}

/*
 * The geographies should be the result of calling
 * `await readGeographies({ get_published: true })`
 */
export async function processPolicy(policy: Policy, geographies: Geography[]) {
  const provider_ids = getProviderIDs(policy.provider_ids)
  const processorFunction = getProcessorType(policy.rules[0].rule_type)
  const complianceResponsePromises = []
  for (const provider_id of provider_ids) {
    complianceResponsePromises.push(createComplianceResponse(policy, provider_id, geographies, processorFunction))
  }
  const results = await Promise.all(complianceResponsePromises)
  // filter out undefined results
  return results.filter(result => !!result)
}