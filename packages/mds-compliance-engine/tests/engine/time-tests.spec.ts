import test from 'unit.js'

import { makeDevices, makeEventsWithTelemetry } from '@mds-core/mds-test-data'
import { RULE_TYPES, Geography, Policy, Device, VehicleEvent, Telemetry, TimeRule } from '@mds-core/mds-types'

import { la_city_boundary } from '@mds-core/mds-policy/tests/la-city-boundary'
import { FeatureCollection } from 'geojson'
import { minutes } from '@mds-core/mds-utils'
import { ComplianceResult, MatchedVehicleInformation, VehicleEventWithTelemetry } from '../../@types'
import { generateDeviceMap } from './helpers'
import { isTimeRuleMatch, processTimePolicy } from '../../engine/time_processors'

const CITY_OF_LA = '1f943d59-ccc9-4d91-b6e2-0c5e771cbc49'

const geographies: Geography[] = [
  { name: 'la', geography_id: CITY_OF_LA, geography_json: la_city_boundary as FeatureCollection }
]

process.env.TIMEZONE = 'America/Los_Angeles'

function now(): number {
  return Date.now()
}

const TIME_POLICY: Policy = {
  policy_id: 'a2c9a65f-fd85-463e-9564-fc95ea473f7d',
  name: 'Maximum Idle Time',
  description: 'LADOT Pilot Idle Time Limitations',
  start_date: 1552678594428,
  end_date: null,
  prev_policies: null,
  rules: [
    {
      name: 'Greater LA (rentable)',
      rule_id: '5e18fcdf-8847-4842-bc83-c2ad76fb7b10',
      rule_type: 'time',
      rule_units: 'minutes',
      geographies: ['1f943d59-ccc9-4d91-b6e2-0c5e771cbc49'],
      states: {
        available: []
      },
      vehicle_types: ['bicycle', 'scooter'],
      maximum: 20
    }
  ]
}

describe('Tests Compliance Engine Time Functionality', () => {
  it('Verifies time compliance', done => {
    const devices = makeDevices(400, now())
    const events = makeEventsWithTelemetry(devices, now(), CITY_OF_LA, {
      event_types: ['trip_end'],
      vehicle_state: 'available',
      speed: 0
    }) as VehicleEventWithTelemetry[]

    const deviceMap: { [d: string]: Device } = generateDeviceMap(devices)

    const result = processTimePolicy(TIME_POLICY, events, geographies, deviceMap) as ComplianceResult
    test.assert.deepEqual(result.vehicles_found.length, 0)
    test.assert.deepEqual(result.total_violations, 0)

    done()
  })

  it('Verifies time compliance violation', done => {
    const badDevices = makeDevices(400, now())
    const badEvents = makeEventsWithTelemetry(badDevices, now() - minutes(21), CITY_OF_LA, {
      event_types: ['trip_end'],
      vehicle_state: 'available',
      speed: 0
    })

    const goodDevices = makeDevices(5, now())
    const goodEvents = makeEventsWithTelemetry(goodDevices, now(), CITY_OF_LA, {
      event_types: ['trip_end'],
      vehicle_state: 'available',
      speed: 0
    })

    const deviceMap: { [d: string]: Device } = generateDeviceMap([...badDevices, ...goodDevices])

    const result = processTimePolicy(
      TIME_POLICY,
      [...badEvents, ...goodEvents] as (VehicleEvent & { telemetry: Telemetry })[],
      geographies,
      deviceMap
    ) as ComplianceResult
    test.assert.deepEqual(result.vehicles_found.length, 400)
    test.assert.deepEqual(result.total_violations, 400)

    const { rule_id } = TIME_POLICY.rules[0]

    // Note that for speed rule matches, `rule_applied` is never null.
    const finalCount = result.vehicles_found.reduce((count: number, vehicle: MatchedVehicleInformation) => {
      if (vehicle.rule_applied === rule_id && vehicle.rules_matched.includes(rule_id)) {
        // eslint-disable-next-line no-param-reassign
        count += 1
      }
      return count
    }, 0)
    test.assert.deepEqual(finalCount, 400)
    done()
  })

  it('verifies time match rule', done => {
    const { 0: rule } = TIME_POLICY.rules
    const goodDevices = makeDevices(1, now())
    const goodEvents = makeEventsWithTelemetry(goodDevices, now(), CITY_OF_LA, {
      event_types: ['trip_end'],
      vehicle_state: 'available',
      speed: 0
    })
    const badDevices = makeDevices(1, now())
    const badEvents = makeEventsWithTelemetry(badDevices, now() - minutes(21), CITY_OF_LA, {
      event_types: ['trip_end'],
      vehicle_state: 'available',
      speed: 0
    })

    test.assert(
      !isTimeRuleMatch(
        rule as TimeRule,
        geographies,
        goodDevices[0],
        goodEvents[0] as VehicleEvent & { telemetry: Telemetry }
      )
    )

    test.assert(
      isTimeRuleMatch(
        rule as TimeRule,
        geographies,
        badDevices[0],
        badEvents[0] as VehicleEvent & { telemetry: Telemetry }
      )
    )
    done()
  })
})