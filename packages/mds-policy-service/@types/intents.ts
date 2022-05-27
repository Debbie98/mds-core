import type { DAY_OF_WEEK, Nullable, Timestamp, UUID } from '@mds-core/mds-types'
import { now, uuid } from '@mds-core/mds-utils'
import type { BaseRule, MicroMobilityStatesToEvents, PolicyDomainModel, TIME_FORMAT } from './models'

export const INTENT_TYPES = ['no_parking'] as const
export type INTENT_TYPE = typeof INTENT_TYPES[number]

export const BASE_POLICY_DEFAULTS = {
  name: '',
  description: '',
  provider_ids: [],
  start_date: now(),
  end_date: null,
  prev_policies: [],
  rules: [],
  currency: null,
  published_date: null
}

export interface BasePolicyIntentUserFields {
  name: string
  description: string
  provider_ids: Nullable<UUID[]>
  start_date: Timestamp
  end_date: Nullable<Timestamp>
}

type PartialMicromobilityRule = Partial<BaseRule<Partial<MicroMobilityStatesToEvents>>>

export type IntentDraft<
  INTENT_TYPE,
  INTENT_RULE_FIELDS extends PartialMicromobilityRule,
  INTENT_POLICY_FIELDS extends Partial<PolicyDomainModel>
> = {
  intent_type: INTENT_TYPE
  rule_fields: INTENT_RULE_FIELDS
  policy_fields: INTENT_POLICY_FIELDS
}

export interface BaseIntentRuleUserFields extends PartialMicromobilityRule {
  geographies: UUID[]
  days?: Nullable<DAY_OF_WEEK[]>
  start_time?: Nullable<TIME_FORMAT>
  end_time?: Nullable<TIME_FORMAT>
}

export type NoParkingIntentDraft = IntentDraft<'no_parking', BaseIntentRuleUserFields, BasePolicyIntentUserFields>

export type NoParkingIntentRule = Omit<
  BaseRule<Partial<MicroMobilityStatesToEvents>, 'count'>,
  'geographies' | 'days' | 'start_time' | 'end_time' | 'rule_id'
>

export const NO_PARKING_INTENT_RULE_FIXED_VALUES: NoParkingIntentRule = {
  accessibility_options: null,
  maximum: 0,
  modality: 'micromobility',
  rate_amount: null,
  rate_recurrence: null,
  name: 'No Parking Zones',
  rule_type: 'count',
  rule_units: 'devices',
  states: { available: [], non_operational: [], reserved: [], unknown: [] },
  value_url: null,
  vehicle_types: ['scooter', 'moped'],
  propulsion_types: [],
  transaction_types: null,
  service_types: null
}

export const INTENT_RULE_CONSTANTS: { [K in INTENT_TYPE]: NoParkingIntentRule } = {
  no_parking: NO_PARKING_INTENT_RULE_FIXED_VALUES
}

// export const INTENT_POLICY_CONSTANTS: { [K in INTENT_TYPE]: }

export function translateTemplateToPolicy<
  INTENT_TYPE,
  INTENT_RULE_TYPE extends PartialMicromobilityRule,
  INTENT_USER_FIELDS extends BasePolicyIntentUserFields
>(draft: IntentDraft<INTENT_TYPE, INTENT_RULE_TYPE, INTENT_USER_FIELDS>, intent_type: INTENT_TYPE): PolicyDomainModel {
  return {
    policy_id: uuid(),
    ...BASE_POLICY_DEFAULTS,
    ...draft.policy_fields,
    rules: [
      {
        rule_id: uuid(),
        ...draft.rule_fields,
        ...INTENT_RULE_CONSTANTS[intent_type]
      }
    ]
  }
}
