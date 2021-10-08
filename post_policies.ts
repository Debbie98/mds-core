import axios from 'axios'
import fs from 'fs'
import { GeographyDomainModel } from './packages/mds-geography-service/index'

const policies = [
  {
    "name": "Prohibited Dockless Zones",
    "rules": [
      {
        "name": "Prohibited Dockless Zones",
        "maximum": 0,
        "rule_id": "92ca2e0c-52d8-48f7-8e2d-f0f7be1b4928",
        "rule_type": "count",
        "geographies": [
          "c0591267-bb6a-4f28-a612-ff7f4a8f8b2a"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "544e2923-ff83-4087-b462-7bb1bde72003",
    "start_date": 1585591200000,
    "description": "Prohibited areas for dockless vehicles within the City of Los Angeles for the LADOT Dockless On-Demand Personal Mobility Program - Migrated from 0.4 92081b54-d23b-4084-9ce2-0212b2806135",
    "prev_policies": null
  },
  {
    "name": "LADOT Mobility Caps: Lime",
    "rules": [
      {
        "name": "SFV DACs",
        "maximum": 0,
        "rule_id": "c473794c-c78f-4f3e-a807-bceef7a69508",
        "rule_type": "count",
        "geographies": [
          "e3ed0a0e-61d3-4887-8b6a-4af4f3769c14"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "All other DACs (scooters)",
        "maximum": 2500,
        "rule_id": "62de6840-84e5-450a-b8a8-72fa43edad24",
        "rule_type": "count",
        "geographies": [
          "0c444869-1674-4234-b4f3-ab5685bcf0d9"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Non-DAC",
        "maximum": 3000,
        "rule_id": "a73f62af-0102-4834-b498-fa16ca2958c9",
        "rule_type": "count",
        "geographies": [
          "1f943d59-ccc9-4d91-b6e2-0c5e771cbc49"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "24930be7-2042-4fbc-bcd8-517cb4bd5b46",
    "start_date": 1558389669540,
    "description": "Mobility caps as described in the One-Year Permit - Migrated from 0.4 f09ad24a-ad0e-4fb0-8770-4fd24e06eb2c",
    "provider_ids": [
      "63f13c48-34ff-49d2-aca7-cf6a5b6171c3"
    ],
    "prev_policies": null
  },
  {
    "name": "LADOT Mobility Caps: Sherpa",
    "rules": [
      {
        "name": "SFV DACs",
        "maximum": 410,
        "rule_id": "6a4ad66e-3a5f-4756-ab92-76221fc30145",
        "rule_type": "count",
        "geographies": [
          "e3ed0a0e-61d3-4887-8b6a-4af4f3769c14"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "All other DACs (scooters)",
        "maximum": 0,
        "rule_id": "3aabe9ac-ce2d-4c8c-a16e-9876d0a43dcb",
        "rule_type": "count",
        "geographies": [
          "0c444869-1674-4234-b4f3-ab5685bcf0d9"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Non-DAC",
        "maximum": 260,
        "rule_id": "732e1506-1336-45a6-99de-f19139af4bc2",
        "rule_type": "count",
        "geographies": [
          "1f943d59-ccc9-4d91-b6e2-0c5e771cbc49"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "59220a03-24aa-46a9-8202-6aa21c2a8552",
    "start_date": 1558389669540,
    "description": "Mobility caps as described in the One-Year Permit - Migrated from 0.4 59f25ae6-3ec7-4642-a594-f8d2f6d97362",
    "provider_ids": [
      "3c95765d-4da6-41c6-b61e-1954472ec6c9"
    ],
    "prev_policies": null
  },
  {
    "name": "Venice Special Operating Zone Fleet Cap (Revised July 2021)",
    "rules": [
      {
        "name": "Venice Beach SOZ: Operator Fleet Cap",
        "maximum": 150,
        "rule_id": "d8c0c503-6133-4480-8a93-c7fb7c61d712",
        "rule_type": "count",
        "geographies": [
          "e0e4a085-7a50-43e0-afa4-6792ca897c5a"
        ],
        "vehicle_types": [
          "scooter",
          "bicycle"
        ],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "0ac111d9-bafc-40ee-a7f3-56e184bbdc72",
    "start_date": 1629500400000,
    "description": "Fleet caps for all operators in the Venice Special Operating Zone - Migrated from 0.4 89dd55db-d26b-459f-84bc-a2cc14937ffb",
    "provider_ids": [],
    "prev_policies": null
  },
  {
    "name": "Venice Special Operations Zone: Morning Deployment Policy (Revised July 2021)",
    "rules": [
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "01d0e15e-852f-4cb0-9ae4-fd44b495d018",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "6dc968c7-19f4-421c-b9d1-683dd3cdb632"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "4106cba1-1c5e-441a-8d30-aefe760153f0",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "aa4dc424-09e4-48f3-8471-df5186927016"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "343af09b-0312-4395-a1cd-776f6c9ae86a",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "f5f4a15d-447f-4969-aedb-a0e94ae5b183"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "eaa093f1-62dd-4efd-9b5d-369bbfd134e0",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "fb411640-0220-43f4-bfc7-6f01350dadfe"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "b17de5f8-c0e8-4a7e-8523-a3121d11890b",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "456c25f0-a9ce-4ff3-8610-3cee919a3539"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "54219dc7-380a-48d8-ba85-4609bfcfe5b8",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "0a484e09-7a95-4e7d-86c7-a10a58268ee2"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "6355432a-c406-45ed-8d74-dfa6a77372af",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "06b4e69e-da53-4340-8354-5a2262034657"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "162793f6-ecba-4b33-bebf-a612e759fc9e",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "b1fdf441-ce46-4f22-bb70-dd2e99df1001"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "5a8d5e43-6bcb-4075-b09e-b338720bc0b5",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "2166b7dd-10ab-4219-9921-0d8c0f082308"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "eab38951-0709-49e3-b2c4-c282854c13ac",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "86f9a2bd-48c8-4447-b6eb-60916da16aa1"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "ada1f4b9-2421-4f2f-8830-7709df7a8f68",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "d5d889c5-b6b9-4b83-bbcb-f5209d8dbcc3"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "25bed27b-ba6c-425d-93b5-81222213cf02",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "5a5b5ffa-5f9f-4db8-ba09-72c5deaac41a"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "510031c6-7466-466b-a746-030356c9bdc2",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "2a4fbdb9-ff76-4060-aa92-1d37e26732e8"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "e8228ae4-be3a-4abb-9522-f5e46bb1b0b7",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "8ce201f3-34d7-46a2-aed3-282fcb6938ac"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "a20d1ece-544a-459e-8499-35c1138c8d14",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "2d7f76f0-f45e-4563-8be1-280f77b1181a"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "019ab28e-d34d-4f59-aff8-4d5f0118ffc2",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "45e85d25-a1bd-4972-9871-d7762e1ffe8f"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "37f33c3a-ce2e-434c-9e28-8eaa881ac0e9",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "9912fa40-b594-492f-91d0-113a7568bb2b"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "d7064e6d-084a-4494-9786-84484e2819a0",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "e1d54dc4-9466-4d7b-bcf2-e873716d0a7b"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "01d74a3b-cd01-44a1-a107-fcd442b035f3",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "9bb19cd1-2530-4f7f-8de0-80e7326a3e32"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "04af0c8c-3348-46b3-b0c2-294f76d96ece",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "2aa25299-514e-4b3f-9828-533649ceff2e"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "36d01a5d-23eb-4012-83c7-0efa82e69d97",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "fe9c910a-7aca-4a42-9d63-e014b3c243d7"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "5a9633a7-10a4-4433-8cf5-22a213b5a7a7",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "7beb1d83-66e7-4654-8c6b-6710fa26d1bd"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "e60e6e97-7879-49f2-9839-2d8687a03b65",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "c7553640-730f-4ae1-a422-68bac4b849cc"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "6dcb8c27-51fd-4ac3-b522-9554be466319",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "e42f7e97-b5e6-4ebe-8ddc-05fc806ce54e"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "9dda03a9-752c-4d63-aed8-5324ccf89d1d",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "b539054b-541a-43b3-a182-58a0bd0958fd"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "2f697a5c-3238-4df7-9d6d-7cb2c0ac10ec",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "73779ce8-e0fb-48c0-96ba-a1e7f7738279"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "01e5306f-cbfa-42c6-843b-50bb4141f9d8",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "050a198c-5d63-4ce4-893e-733f458b88d1"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "a90a0543-33ac-4762-ac10-c5d0df760f9c",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "8b318b49-664b-4efb-a54f-5eb7d8e18112"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "53301e92-6244-497b-a5af-7139bed6cb95",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "782832e5-3784-465d-a88b-8a30756a9a3b"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "48b88423-83f2-4d75-a17a-7628e6f52e64",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "f625d1a8-a9d5-49c2-aa2c-d3b8f6f5e931"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "34d7cdc3-83af-48d6-a3f9-a3c30f03bd97",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "59b061bf-5eba-44de-8359-8325933e6daf"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "5826e37e-23b3-4418-9d1c-c9f081903cf3",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "41653233-80a2-47b6-9b35-4f2d78edf6d5"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "766b158c-dde2-40ae-9386-e80708bf54a1",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "b9cf1e52-7475-4fa9-bc48-5f882b58dfbb"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "1bff0a3a-08df-48f7-9c4d-1166c6146648",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "a5ae0a20-e236-41cc-b820-f944f16dc332"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "6b342d9f-b3a8-4d3f-88cf-8bfe4abbf850",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "15d9ce9e-ed47-43ae-929a-5066145b9ddf"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "42875450-4a3e-48af-a10d-a2197c21cfa5",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "5bb510c1-5641-4377-acfb-86954d979047"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "708a1ce3-0d7b-44db-ac85-03c8f8bb70dc",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "a4b11ed5-3709-4b55-9114-df857a2c6bde"
        ],
        "vehicle_types": [],
        "states": {
          "reserved": [],
          "available": []
        },
        "modality": "micromobility"
      },
      {
        "name": "No provider deployments or rebalancing outside of parking zones",
        "maximum": 0,
        "rule_id": "b984ffef-1943-429c-b10b-e040a5617266",
        "rule_type": "count",
        "geographies": [
          "d556c031-7b75-4ac0-b9d9-186ea2723884"
        ],
        "vehicle_types": [],
        "states": {
          "available": [
            "on_hours",
            "provider_drop_off"
          ],
          "elsewhere": [
            "on_hours",
            "provider_drop_off"
          ],
          "non_operational": [
            "on_hours",
            "provider_drop_off"
          ],
          "on_trip": [
            "on_hours",
            "provider_drop_off"
          ],
          "removed": [
            "on_hours",
            "provider_drop_off"
          ],
          "reserved": [
            "on_hours",
            "provider_drop_off"
          ],
          "unknown": [
            "on_hours",
            "provider_drop_off"
          ]
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "a31a7a17-2b15-46f4-8c87-cf2369eeb4e5",
    "start_date": 1629500400000,
    "description": "Operators are authorized to begin daily deployment only between the hours of 5:00 a.m. to 10:00 a.m., daily, AND are authorized to deploy up to a maximum of 5 vehicles per parking zone. - Migrated from 0.4 79775810-2c29-45d6-8512-6772bdc1357f",
    "provider_ids": [],
    "prev_policies": null
  },
  {
    "name": "LADOT Mobility Caps: Bird",
    "rules": [
      {
        "name": "SFV DACs",
        "maximum": 1000,
        "rule_id": "37c7b136-5c9d-4e40-b81e-ef679a5f4ab7",
        "rule_type": "count",
        "geographies": [
          "e3ed0a0e-61d3-4887-8b6a-4af4f3769c14"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "All other DACs",
        "maximum": 2500,
        "rule_id": "2929b97f-35ba-4033-b960-c2ba9d4dffce",
        "rule_type": "count",
        "geographies": [
          "0c444869-1674-4234-b4f3-ab5685bcf0d9"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Non-DAC",
        "maximum": 3000,
        "rule_id": "e1a6f492-bd7b-4850-aa57-3eb3e1c0a412",
        "rule_type": "count",
        "geographies": [
          "1f943d59-ccc9-4d91-b6e2-0c5e771cbc49"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "0609d5e5-959d-4c06-9c6c-9643ddf5f20b",
    "start_date": 1558389669540,
    "description": "Mobility caps as described in the One-Year Permit - Migrated from 0.4 99f7a469-6e3a-4981-9313-c2f6c0bbd5ce",
    "provider_ids": [
      "2411d395-04f2-47c9-ab66-d09e9e3c3251"
    ],
    "prev_policies": null
  },
  {
    "name": "Hollywood Boulevard SOZ",
    "rules": [
      {
        "name": "No reserving, no starting trips, no ending trips, no deployments allowed in Hollywood Blvd SOZ",
        "maximum": 0,
        "rule_id": "a6338a46-5b21-45c4-a8ba-c7fd2ec2e874",
        "rule_type": "count",
        "geographies": [
          "b1a89ba2-379e-400b-8028-a8d6e15e04df"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "available": [
            "trip_start",
            "trip_enter_jurisdiction",
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "off_hours"
          ],
          "elsewhere": [
            "trip_start",
            "trip_enter_jurisdiction",
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "off_hours"
          ],
          "non_operational": [
            "trip_start",
            "trip_enter_jurisdiction",
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "off_hours"
          ],
          "on_trip": [
            "trip_start",
            "trip_enter_jurisdiction",
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "off_hours"
          ],
          "removed": [
            "trip_start",
            "trip_enter_jurisdiction",
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "off_hours"
          ],
          "reserved": [
            "trip_start",
            "trip_enter_jurisdiction",
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "off_hours"
          ],
          "unknown": [
            "trip_start",
            "trip_enter_jurisdiction",
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "off_hours"
          ]
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "c8b88d5f-126a-44d4-a508-c500695c60c9",
    "start_date": 1589587200000,
    "description": "No vehicles are allowed to start or end trips; Providers are not allowed to drop vehicles in this geography - Migrated from 0.4 bc38628f-50c0-4d58-81d0-30c5318902da",
    "provider_ids": [
    ],
    "prev_policies": null
  },
  {
    "name": "LADOT Mobility Caps: Jump",
    "rules": [
      {
        "name": "SFV DACs",
        "maximum": 0,
        "rule_id": "381ff2ea-33f9-494c-9619-f3b5abf49fc4",
        "rule_type": "count",
        "geographies": [
          "e3ed0a0e-61d3-4887-8b6a-4af4f3769c14"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "All other DACs (bikes)",
        "maximum": 1250,
        "rule_id": "e484a6a4-0b73-4b50-8c30-b99f2c216326",
        "rule_type": "count",
        "geographies": [
          "0c444869-1674-4234-b4f3-ab5685bcf0d9"
        ],
        "vehicle_types": [
          "bicycle"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "All other DACs (scooters)",
        "maximum": 1250,
        "rule_id": "805b54ed-688d-448b-860d-2fdbe8cce4b3",
        "rule_type": "count",
        "geographies": [
          "0c444869-1674-4234-b4f3-ab5685bcf0d9"
        ],
        "vehicle_types": [
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Non-DAC",
        "maximum": 1500,
        "rule_id": "9ff80cf7-c3a8-4231-9ea4-9d9412622424",
        "rule_type": "count",
        "geographies": [
          "1f943d59-ccc9-4d91-b6e2-0c5e771cbc49"
        ],
        "vehicle_types": [
          "bicycle"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Non-DAC",
        "maximum": 1500,
        "rule_id": "8c61e538-9772-43d9-8f48-9e36cb13f931",
        "rule_type": "count",
        "geographies": [
          "1f943d59-ccc9-4d91-b6e2-0c5e771cbc49"
        ],
        "vehicle_types": [
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "a6cc7a12-a643-492b-be96-9a7dc86a1838",
    "start_date": 1558389669540,
    "description": "Mobility caps as described in the One-Year Permit - Migrated from 0.4 221efc03-c3ad-4868-b628-eef93f05e1d6",
    "provider_ids": [
      "c20e08cf-8488-46a6-a66c-5d8fb827f7e0"
    ],
    "prev_policies": null
  },
  {
    "name": "LADOT Mobility Caps: Lyft",
    "rules": [
      {
        "name": "SFV DACs",
        "maximum": 500,
        "rule_id": "cafa4ca5-81da-4067-935f-b116d7980452",
        "rule_type": "count",
        "geographies": [
          "e3ed0a0e-61d3-4887-8b6a-4af4f3769c14"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "All other DACs (scooters)",
        "maximum": 500,
        "rule_id": "4e229804-8c38-4f7a-9bd2-89a76da5a02b",
        "rule_type": "count",
        "geographies": [
          "0c444869-1674-4234-b4f3-ab5685bcf0d9"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Non-DAC",
        "maximum": 3000,
        "rule_id": "e4a4e35b-c16f-4131-ad3a-33e7e5f7e5b7",
        "rule_type": "count",
        "geographies": [
          "1f943d59-ccc9-4d91-b6e2-0c5e771cbc49"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "14231c38-f6e7-40f9-a803-9be8ec23194a",
    "start_date": 1558389669540,
    "description": "Mobility caps as described in the One-Year Permit - Migrated from 0.4 284a5199-365e-4b9d-b5d0-842ea7b1d4f7",
    "provider_ids": [
      "e714f168-ce56-4b41-81b7-0b6a4bd26128"
    ],
    "prev_policies": null
  },
  {
    "name": "LADOT Mobility Caps: Spin",
    "rules": [
      {
        "name": "SFV DACs",
        "maximum": 5000,
        "rule_id": "d7262cbc-3bfa-425d-9832-ae559d02c17f",
        "rule_type": "count",
        "geographies": [
          "e3ed0a0e-61d3-4887-8b6a-4af4f3769c14"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "All other DACs (scooters)",
        "maximum": 2500,
        "rule_id": "38d43e44-829b-45f4-8087-5ff4f498f053",
        "rule_type": "count",
        "geographies": [
          "0c444869-1674-4234-b4f3-ab5685bcf0d9"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Non-DAC",
        "maximum": 3000,
        "rule_id": "de858b90-188e-4566-93af-0a7f2d67c62a",
        "rule_type": "count",
        "geographies": [
          "1f943d59-ccc9-4d91-b6e2-0c5e771cbc49"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "257e2158-c298-4b87-af79-ee2bbe109bba",
    "start_date": 1558389669540,
    "description": "Mobility caps as described in the One-Year Permit - Migrated from 0.4 784bb9d8-ae82-49a2-83f2-fe01c8e1bb7b",
    "provider_ids": [
      "70aa475d-1fcd-4504-b69c-2eeb2107f7be"
    ],
    "prev_policies": null
  },
  {
    "name": "LADOT Mobility Caps: Wheels",
    "rules": [
      {
        "name": "SFV DACs",
        "maximum": 0,
        "rule_id": "1ddad5e4-81f3-4ffb-970c-8e94383b26b6",
        "rule_type": "count",
        "geographies": [
          "e3ed0a0e-61d3-4887-8b6a-4af4f3769c14"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "All other DACs (scooters)",
        "maximum": 0,
        "rule_id": "e16b3f18-9bc0-42b9-ba2b-b96cd36b8dc3",
        "rule_type": "count",
        "geographies": [
          "0c444869-1674-4234-b4f3-ab5685bcf0d9"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      },
      {
        "name": "Non-DAC",
        "maximum": 3000,
        "rule_id": "53a72f9c-2f80-472d-a00b-8d30072426f0",
        "rule_type": "count",
        "geographies": [
          "1f943d59-ccc9-4d91-b6e2-0c5e771cbc49"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "4ee2b155-86b3-4932-a38f-00ec75f423e0",
    "start_date": 1558389669540,
    "description": "Mobility caps as described in the One-Year Permit - Migrated from 0.4 65207595-dfdc-4653-bc4c-7cca29f69cb7",
    "provider_ids": [
      "b79f8687-526d-4ae6-80bf-89b4c44dc071"
    ],
    "prev_policies": null
  },
  {
    "name": "Hollywood Boulevard SOZ (2 hour pick-up policy)",
    "rules": [
      {
        "name": "Provider must pickup violations within 2hrs",
        "maximum": 120,
        "rule_id": "47efb07e-6557-45b0-95b0-48503b67725d",
        "rule_type": "time",
        "rule_units": "minutes",
        "geographies": [
          "b1a89ba2-379e-400b-8028-a8d6e15e04df"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "available": [
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "reservation_cancel",
            "off_hours"
          ],
          "elsewhere": [
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "reservation_cancel",
            "off_hours"
          ],
          "non_operational": [
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "reservation_cancel",
            "off_hours"
          ],
          "on_trip": [
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "reservation_cancel",
            "off_hours"
          ],
          "removed": [
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "reservation_cancel",
            "off_hours"
          ],
          "reserved": [
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "reservation_cancel",
            "off_hours"
          ],
          "unknown": [
            "reservation_start",
            "on_hours",
            "trip_end",
            "provider_drop_off",
            "reservation_cancel",
            "off_hours"
          ]
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "2a109889-5014-41ff-ace2-bf51849df93a",
    "start_date": 1589587200000,
    "description": "Providers have 2 hours to pick up a vehicle if one should be found with any of the listed states - Migrated from 0.4 0aebcfba-4494-4e42-b0aa-1f66aa45b54e",
    "provider_ids": [
    ],
    "prev_policies": null
  },
  {
    "name": "Venice Special Operations Zone: Morning Deployment Policy",
    "rules": [
      {
        "name": "Morning deployment drop off caps",
        "maximum": 5,
        "rule_id": "27506c4c-0ec9-4327-8a05-0c6d793163af",
        "end_time": "10:00:00",
        "rule_type": "count",
        "start_time": "05:00:00",
        "geographies": [
          "6dc968c7-19f4-421c-b9d1-683dd3cdb632",
          "aa4dc424-09e4-48f3-8471-df5186927016",
          "f5f4a15d-447f-4969-aedb-a0e94ae5b183",
          "fb411640-0220-43f4-bfc7-6f01350dadfe",
          "456c25f0-a9ce-4ff3-8610-3cee919a3539",
          "0a484e09-7a95-4e7d-86c7-a10a58268ee2",
          "06b4e69e-da53-4340-8354-5a2262034657",
          "b1fdf441-ce46-4f22-bb70-dd2e99df1001",
          "2166b7dd-10ab-4219-9921-0d8c0f082308",
          "86f9a2bd-48c8-4447-b6eb-60916da16aa1",
          "d5d889c5-b6b9-4b83-bbcb-f5209d8dbcc3",
          "5a5b5ffa-5f9f-4db8-ba09-72c5deaac41a",
          "2a4fbdb9-ff76-4060-aa92-1d37e26732e8",
          "8ce201f3-34d7-46a2-aed3-282fcb6938ac",
          "2d7f76f0-f45e-4563-8be1-280f77b1181a",
          "45e85d25-a1bd-4972-9871-d7762e1ffe8f",
          "9912fa40-b594-492f-91d0-113a7568bb2b",
          "e1d54dc4-9466-4d7b-bcf2-e873716d0a7b",
          "9bb19cd1-2530-4f7f-8de0-80e7326a3e32",
          "2aa25299-514e-4b3f-9828-533649ceff2e",
          "fe9c910a-7aca-4a42-9d63-e014b3c243d7",
          "7beb1d83-66e7-4654-8c6b-6710fa26d1bd",
          "c7553640-730f-4ae1-a422-68bac4b849cc",
          "e42f7e97-b5e6-4ebe-8ddc-05fc806ce54e",
          "b539054b-541a-43b3-a182-58a0bd0958fd",
          "73779ce8-e0fb-48c0-96ba-a1e7f7738279"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "available": [
            "provider_drop_off",
            "on_hours"
          ],
          "elsewhere": [
            "provider_drop_off",
            "on_hours"
          ],
          "non_operational": [
            "provider_drop_off",
            "on_hours"
          ],
          "on_trip": [
            "provider_drop_off",
            "on_hours"
          ],
          "removed": [
            "provider_drop_off",
            "on_hours"
          ],
          "reserved": [
            "provider_drop_off",
            "on_hours"
          ],
          "unknown": [
            "provider_drop_off",
            "on_hours"
          ]
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "c5395c80-e34c-4a17-972e-cb85e431d7de",
    "start_date": 1602745200000,
    "description": "Operators are authorized to begin daily deployment only between the hours of 5:00 a.m. to 10:00 a.m., daily, AND are authorized to deploy up to a maximum of 5 vehicles per parking zone. - Migrated from 0.4 7aa08efa-7b55-4fa9-a20b-d4b106216fc6",
    "provider_ids": [],
    "prev_policies": null
  },
  {
    "name": "Venice Beach Walk Streets: 5 mph speed limit",
    "rules": [
      {
        "name": "Venice Beach Walk Streets: 5 mph speed limit",
        "maximum": 5,
        "rule_id": "51a91c32-f5ab-4d5f-ad23-40f079741681",
        "rule_type": "speed",
        "rule_units": "mph",
        "geographies": [
          "5834b884-a547-47c0-8836-366756d9b648"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {},
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "1ca6ed8b-34d3-4a2e-b6b8-358549d6f7b1",
    "start_date": 1602745200000,
    "description": "Venice Beach Walk Streets: 5 mph speed limit on certain locations - Migrated from 0.4 33643419-243a-45fe-a7a0-a612d2f3d4c9",
    "provider_ids": [],
    "prev_policies": null
  },
  {
    "name": "Venice Beach Walk Streets: Ride-through only",
    "rules": [
      {
        "name": "No start/end trips, no fleet deployments",
        "minimum": 0,
        "rule_id": "da0ed61b-1eb4-4ec6-8498-44b72c100276",
        "rule_type": "count",
        "geographies": [
          "8e2c6043-8b9a-431b-95ba-9c5f37152e3d"
        ],
        "vehicle_types": [
          "bicycle",
          "scooter"
        ],
        "states": {
          "on_trip": [],
          "reserved": [],
          "available": [],
          "non_operational": []
        },
        "modality": "micromobility"
      }
    ],
    "end_date": null,
    "policy_id": "16f351be-f328-4e53-8464-cf28e0b83e71",
    "start_date": 1602745200000,
    "description": "Venice Beach Walk Streets: Ride-through only,  no start/end trips, no fleet deployments - Migrated from 0.4 c48c9266-d6c7-42ab-99a3-9c91d0918ebf",
    "provider_ids": [],
    "prev_policies": null
  }
]

///*
const headers: any = {
  'Content-Type': 'application/json',
  Authorization:
    'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVWkJRVFUwT0RJNE9EbERRakl3TWpJeE0wVkZNamhHTmtaRFFUa3lSRGRGTmtSRFF6RkZOUSJ9.eyJodHRwczovL2xhZG90LmlvL3Byb3ZpZGVyX2lkIjoiNWY3MTE0ZDEtNDA5MS00NmVlLWI0OTItZTU1ODc1ZjdkZTAwIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmxhZG90LmlvLyIsInN1YiI6IjE4UmN1QVJLQzVSUHQ5ZmFON0VRNXdjRTVvUmNlbzB0QGNsaWVudHMiLCJhdWQiOiJodHRwczovL3NhbmRib3gubGFkb3QuaW8vIiwiaWF0IjoxNjMzNjUwMzk1LCJleHAiOjE2MzM3MzY3OTUsImF6cCI6IjE4UmN1QVJLQzVSUHQ5ZmFON0VRNXdjRTVvUmNlbzB0Iiwic2NvcGUiOiJhZG1pbjphbGwgYXVkaXRzOmRlbGV0ZSBhdWRpdHM6cmVhZCBhdWRpdHM6dmVoaWNsZXM6cmVhZCBhdWRpdHM6d3JpdGUgY29tcGxpYW5jZTpyZWFkIGNvbXBsaWFuY2U6cmVhZDpwcm92aWRlciBldmVudHM6cmVhZCBldmVudHM6d3JpdGU6cHJvdmlkZXIgcG9saWNpZXM6ZGVsZXRlIHBvbGljaWVzOnB1Ymxpc2ggcG9saWNpZXM6cmVhZCBwb2xpY2llczp3cml0ZSBwcm92aWRlcnM6cmVhZCBzZXJ2aWNlX2FyZWFzOnJlYWQgc3RhdHVzX2NoYW5nZXM6cmVhZCB0ZWxlbWV0cnk6d3JpdGU6cHJvdmlkZXIgdHJpcHM6cmVhZCB2ZWhpY2xlczpyZWFkIHZlaGljbGVzOnJlYWQ6cHJvdmlkZXIgdmVoaWNsZXM6d3JpdGU6cHJvdmlkZXIgZXZlbnRzOnJlYWQ6cHJvdmlkZXIgbWV0cmljczpyZWFkIG1ldHJpY3M6cmVhZDpwcm92aWRlciBwb2xpY2llczpyZWFkOnB1Ymxpc2hlZCBwb2xpY2llczpyZWFkOnVucHVibGlzaGVkIGdlb2dyYXBoaWVzOnJlYWQ6cHVibGlzaGVkIGdlb2dyYXBoaWVzOnJlYWQ6dW5wdWJsaXNoZWQgZ2VvZ3JhcGhpZXM6cHVibGlzaCBqdXJpc2RpY3Rpb25zOndyaXRlIGp1cmlzZGljdGlvbnM6cmVhZCBqdXJpc2RpY3Rpb25zOnJlYWQ6Y2xhaW0gZ2VvZ3JhcGhpZXM6d3JpdGUiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.qkJUf5piif1N0JzvNXaPuTyHjsTZABHfa5-aFBQeYXhC_Qhqn0eHhUQE53qN0qhtet3RGAolxADDfdA5hrvpIwfcCwSGHJ3raofy8e8o-FTCYcOOMj7M7Vd-tks5jbYP3Lz1OqL4ZOwPhzrv6phhgg6dv23KC2UW43PHbx3yJN-hoMixcdRXZ0ASlECbtqzf4s_X0E9I0151hidGBYN578RdGMRecZ1yFjpBC1dWyZeW9zo6nqwAK2VDeltGM2igO_1lUtwSGpr5K_pLUTD0oFsErbcXm3j5KBeHuxIFjnMMJbP4ilVoJB7TrFn7LteU449sgKmj_g0zvDaUNXKA0Q'
}
//*/


/*
Promise.all(policies.map(policy => {
  policy.start_date = 1633742323229
  axios.put(`https://api.ladot.io/v1/policy-author/policies/${policy.policy_id}`, policy, { headers })
})).then(res => {
//  console.log(res)
}).catch(err => console.log(err.response))
//*/

const policy_ids: string[] = policies.map(p => p.policy_id)

///*
Promise.all(policy_ids.map(id => {
  axios.post(`https://api.ladot.io/v1/policy-author/policies/${id}/publish`, {}, { headers })
})).then(res => {
//  console.log(res)
}).catch(err => console.log(err.response))
//*/
