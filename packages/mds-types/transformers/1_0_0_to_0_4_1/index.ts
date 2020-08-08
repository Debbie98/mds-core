import { VEHICLE_REASON_0_4_1, VehicleEvent_v0_4_1, VEHICLE_EVENT_0_4_1 } from '../@types'
import { VEHICLE_EVENT, VehicleEvent } from '../../index'

export const FULL_STATE_MAPPING_1_0_0_to_0_4_1: {
  [P in VEHICLE_EVENT]: {
    event_type: VEHICLE_EVENT_0_4_1
    event_type_reason?: VEHICLE_REASON_0_4_1
  }
} = {
  agency_drop_off: { event_type: 'agency_drop_off' },
  agency_pick_up: { event_type: 'agency_pick_up' },
  battery_low: { event_type: 'service_end', event_type_reason: 'low_battery' },
  reservation_cancel: {
    event_type: 'cancel_reservation'
  },
  decommissioned: {
    event_type: 'deregister',
    event_type_reason: 'decommissioned'
  },
  missing: {
    event_type: 'deregister',
    event_type_reason: 'missing'
  },
  provider_drop_off: {
    event_type: 'provider_drop_off'
  },
  rebalance_pick_up: {
    event_type: 'provider_pick_up',
    event_type_reason: 'rebalance'
  },
  maintenance_pick_up: {
    event_type: 'provider_pick_up',
    event_type_reason: 'maintenance'
  },
  compliance_pick_up: {
    event_type: 'provider_pick_up',
    event_type_reason: 'compliance'
  },
  reservation_start: {
    event_type: 'reserve'
  },
  on_hours: {
    event_type: 'service_start'
  },
  maintenance: {
    event_type: 'service_end',
    event_type_reason: 'maintenance'
  },
  off_hours: {
    event_type: 'service_end',
    event_type_reason: 'off_hours'
  },
  trip_end: {
    event_type: 'trip_end'
  },
  trip_enter_jurisdiction: {
    event_type: 'trip_enter'
  },
  trip_leave_jurisdiction: {
    event_type: 'trip_leave'
  },
  trip_start: {
    event_type: 'trip_start'
  },
  battery_charged: {
    event_type: 'service_start'
  },
  trip_cancel: {
    event_type: 'no_backconversion_available'
  },
  comms_lost: {
    event_type: 'no_backconversion_available'
  },
  comms_restored: {
    event_type: 'no_backconversion_available'
  },
  system_resume: {
    event_type: 'no_backconversion_available'
  },
  system_suspend: {
    event_type: 'no_backconversion_available'
  },
  unspecified: {
    event_type: 'no_backconversion_available'
  }
}

function convert_v1_0_0_to_v0_4_1_helper(event: VehicleEvent, current_event_type: VEHICLE_EVENT): VehicleEvent_v0_4_1 {
  const { event_type, event_type_reason } = FULL_STATE_MAPPING_1_0_0_to_0_4_1[current_event_type]
  return {
    device_id: event.device_id,
    provider_id: event.provider_id,
    timestamp: event.timestamp,
    timestamp_long: event.timestamp_long,
    delta: event.delta,
    event_type,
    event_type_reason,
    telemetry_timestamp: event.telemetry_timestamp,
    trip_id: event.trip_id,
    service_area_id: null,
    recorded: event.recorded
  }
}

export function convert_v1_0_0_to_v0_4_1(event: VehicleEvent): VehicleEvent_v0_4_1[] {
  return event.event_types.map(event_type => {
    return convert_v1_0_0_to_v0_4_1_helper(event, event_type)
  })
}
