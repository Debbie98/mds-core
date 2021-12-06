# @mds-core/mds-policy-service

## 0.9.5

### Patch Changes

- Updated dependencies [a4fbd91f]
  - @mds-core/mds-logger@0.5.2
  - @mds-core/mds-geography-service@0.5.1
  - @mds-core/mds-repository@0.1.26
  - @mds-core/mds-rpc-common@0.2.8
  - @mds-core/mds-service-helpers@0.4.6
  - @mds-core/mds-stream@0.2.2
  - @mds-core/mds-utils@0.2.13
  - @mds-core/mds-schema-validators@0.3.16

## 0.9.4

### Patch Changes

- Updated dependencies [09e40cd4]
  - @mds-core/mds-geography-service@0.5.0
  - @mds-core/mds-repository@0.1.25
  - @mds-core/mds-schema-validators@0.3.15
  - @mds-core/mds-rpc-common@0.2.7

## 0.9.3

### Patch Changes

- Updated dependencies [a881d6cc]
  - @mds-core/mds-logger@0.5.1
  - @mds-core/mds-geography-service@0.4.1
  - @mds-core/mds-repository@0.1.24
  - @mds-core/mds-rpc-common@0.2.6
  - @mds-core/mds-service-helpers@0.4.5
  - @mds-core/mds-stream@0.2.1
  - @mds-core/mds-utils@0.2.12
  - @mds-core/mds-schema-validators@0.3.14

## 0.9.2

### Patch Changes

- 102aa5a0: Add a namespace property to all info/warn/error logs
- d63d7e8b: Write published policies to Kafka
- c5a51222: Fix database schema/migrations discrepancies
- Updated dependencies [102aa5a0]
- Updated dependencies [17dde73a]
- Updated dependencies [e9e3048d]
  - @mds-core/mds-logger@0.5.0
  - @mds-core/mds-geography-service@0.4.0
  - @mds-core/mds-repository@0.1.23
  - @mds-core/mds-rpc-common@0.2.5
  - @mds-core/mds-service-helpers@0.4.4
  - @mds-core/mds-stream@0.2.0
  - @mds-core/mds-utils@0.2.11
  - @mds-core/mds-schema-validators@0.3.13

## 0.9.1

### Patch Changes

- d4bd927b: Typeorm now supports generated IDENTITY columns in Postgres
- Updated dependencies [d4bd927b]
  - @mds-core/mds-geography-service@0.3.5
  - @mds-core/mds-repository@0.1.22

## 0.9.0

### Minor Changes

- 9d05e6dc: Fixed bug with webpack erasing classnames and assumed alias used.

### Patch Changes

- Updated dependencies [2cd96944]
- Updated dependencies [add4b114]
- Updated dependencies [ec904976]
  - @mds-core/mds-utils@0.2.10
  - @mds-core/mds-logger@0.4.4
  - @mds-core/mds-rpc-common@0.2.4
  - @mds-core/mds-geography-service@0.3.4
  - @mds-core/mds-repository@0.1.21
  - @mds-core/mds-schema-validators@0.3.12
  - @mds-core/mds-service-helpers@0.4.3

## 0.8.2

### Patch Changes

- Updated dependencies [224bfc3a]
  - @mds-core/mds-rpc-common@0.2.3
  - @mds-core/mds-geography-service@0.3.3

## 0.8.1

### Patch Changes

- 70586f15: Meaningless bump to ensure artifacts are built properly
- Updated dependencies [70586f15]
- Updated dependencies [70586f15]
  - @mds-core/mds-utils@0.2.9
  - @mds-core/mds-geography-service@0.3.2
  - @mds-core/mds-logger@0.4.3
  - @mds-core/mds-repository@0.1.20
  - @mds-core/mds-rpc-common@0.2.2
  - @mds-core/mds-schema-validators@0.3.11
  - @mds-core/mds-service-helpers@0.4.2
  - @mds-core/mds-types@0.7.1

## 0.8.0

### Minor Changes

- a156f493: Added pagination to readPolicies().
- a156f493: Refactor policy entity and add pagination to readPolicies.

### Patch Changes

- 2b3c91c4: Switch to RpcRequest and deprecate RpcRequestWithOptions
- Updated dependencies [2b3c91c4]
- Updated dependencies [a156f493]
  - @mds-core/mds-geography-service@0.3.1
  - @mds-core/mds-rpc-common@0.2.1
  - @mds-core/mds-types@0.7.0
  - @mds-core/mds-repository@0.1.19
  - @mds-core/mds-schema-validators@0.3.10
  - @mds-core/mds-service-helpers@0.4.1
  - @mds-core/mds-utils@0.2.8

## 0.7.0

### Minor Changes

- aa1403da: Update RPC client factory methods and implement retry mechanism when services are unavailable

### Patch Changes

- a1061650: Add namespaced logger, clean up excess logger messages
- Updated dependencies [a1061650]
- Updated dependencies [aa1403da]
- Updated dependencies [3f5c4358]
  - @mds-core/mds-geography-service@0.3.0
  - @mds-core/mds-logger@0.4.2
  - @mds-core/mds-repository@0.1.18
  - @mds-core/mds-rpc-common@0.2.0
  - @mds-core/mds-service-helpers@0.4.0
  - @mds-core/mds-utils@0.2.7
  - @mds-core/mds-types@0.6.1
  - @mds-core/mds-schema-validators@0.3.9

## 0.6.6

### Patch Changes

- Updated dependencies [844098d1]
  - @mds-core/mds-rpc-common@0.1.18
  - @mds-core/mds-geography-service@0.2.5

## 0.6.5

### Patch Changes

- Updated dependencies [0a238253]
- Updated dependencies [0a238253]
- Updated dependencies [d1de33fd]
- Updated dependencies [5c02e73f]
  - @mds-core/mds-types@0.6.0
  - @mds-core/mds-utils@0.2.6
  - @mds-core/mds-rpc-common@0.1.17
  - @mds-core/mds-geography-service@0.2.4
  - @mds-core/mds-repository@0.1.17
  - @mds-core/mds-schema-validators@0.3.8
  - @mds-core/mds-service-helpers@0.3.10

## 0.6.4

### Patch Changes

- f501924c: Bump everything due to previous bad release
- Updated dependencies [f501924c]
  - @mds-core/mds-geography-service@0.2.3
  - @mds-core/mds-logger@0.4.1
  - @mds-core/mds-repository@0.1.16
  - @mds-core/mds-rpc-common@0.1.16
  - @mds-core/mds-schema-validators@0.3.7
  - @mds-core/mds-service-helpers@0.3.9
  - @mds-core/mds-types@0.5.5
  - @mds-core/mds-utils@0.2.5

## 0.6.3

### Patch Changes

- 81220ee6: Upgrade typeorm and pg dependencies
- Updated dependencies [71a9d1de]
- Updated dependencies [7bdfdff5]
- Updated dependencies [81220ee6]
- Updated dependencies [71a9d1de]
  - @mds-core/mds-rpc-common@0.1.15
  - @mds-core/mds-types@0.5.4
  - @mds-core/mds-geography-service@0.2.2
  - @mds-core/mds-repository@0.1.15
  - @mds-core/mds-logger@0.4.0
  - @mds-core/mds-schema-validators@0.3.6
  - @mds-core/mds-service-helpers@0.3.8
  - @mds-core/mds-utils@0.2.4

## 0.6.2

### Patch Changes

- Updated dependencies [5167ec02]
  - @mds-core/mds-types@0.5.3
  - @mds-core/mds-geography-service@0.2.1
  - @mds-core/mds-repository@0.1.14
  - @mds-core/mds-rpc-common@0.1.14
  - @mds-core/mds-schema-validators@0.3.5
  - @mds-core/mds-service-helpers@0.3.7
  - @mds-core/mds-utils@0.2.3

## 0.6.1

### Patch Changes

- Updated dependencies [f5403ec3]
- Updated dependencies [c1001aa8]
- Updated dependencies [a0a29a98]
- Updated dependencies [d8b1387e]
- Updated dependencies [15b9d729]
- Updated dependencies [d8b1387e]
- Updated dependencies [15b9d729]
  - @mds-core/mds-logger@0.3.0
  - @mds-core/mds-types@0.5.2
  - @mds-core/mds-schema-validators@0.3.4
  - @mds-core/mds-geography-service@0.2.0
  - @mds-core/mds-repository@0.1.13
  - @mds-core/mds-rpc-common@0.1.13
  - @mds-core/mds-service-helpers@0.3.6
  - @mds-core/mds-utils@0.2.2

## 0.6.0

### Minor Changes

- 4bbb8a3a: Update policy status filter queries.
- d8b10031: Add new TIME_FORMAT type and stricter validation for start_time and end_time

### Patch Changes

- cab133f5: Default to micromobility state map validation when modality is undefined in policy rule
- Updated dependencies [d8b10031]
  - @mds-core/mds-types@0.5.1
  - @mds-core/mds-geography-service@0.1.12
  - @mds-core/mds-repository@0.1.12
  - @mds-core/mds-rpc-common@0.1.12
  - @mds-core/mds-schema-validators@0.3.3
  - @mds-core/mds-service-helpers@0.3.5
  - @mds-core/mds-utils@0.2.1

## 0.5.0

### Minor Changes

- 61e31276: removed mds-db/policy in favor of mds-policy-service, changed Policy to PolicyDomainModel

### Patch Changes

- Updated dependencies [61e31276]
- Updated dependencies [0f548b7f]
  - @mds-core/mds-types@0.5.0
  - @mds-core/mds-utils@0.2.0
  - @mds-core/mds-rpc-common@0.1.11
  - @mds-core/mds-schema-validators@0.3.2
  - @mds-core/mds-geography-service@0.1.11
  - @mds-core/mds-repository@0.1.11
  - @mds-core/mds-service-helpers@0.3.4

## 0.4.1

### Patch Changes

- Updated dependencies [9af14cbb]
  - @mds-core/mds-logger@0.2.4
  - @mds-core/mds-geography-service@0.1.10
  - @mds-core/mds-repository@0.1.10
  - @mds-core/mds-rpc-common@0.1.10
  - @mds-core/mds-service-helpers@0.3.3
  - @mds-core/mds-utils@0.1.36
  - @mds-core/mds-schema-validators@0.3.1

## 0.4.0

### Minor Changes

- 439f92c5: Vastly clean up Policy types, remove generic extension of ApiServer

### Patch Changes

- 439f92c5: Add support for specifying transaction_types and service_types in Rules, ensure that currency is supplied when making a policy with Rate rules
- 707c4317: Make mds-test-data imports portable
- Updated dependencies [439f92c5]
  - @mds-core/mds-schema-validators@0.3.0
  - @mds-core/mds-types@0.4.0
  - @mds-core/mds-rpc-common@0.1.9
  - @mds-core/mds-geography-service@0.1.9
  - @mds-core/mds-repository@0.1.9
  - @mds-core/mds-service-helpers@0.3.2
  - @mds-core/mds-utils@0.1.35

## 0.3.0

### Minor Changes

- 936a0371: Add PresentationOptions for some PolicyService methods, enabling the display of policy status.
- 8a5bb24e: readPolicies can filter by geography_ids

### Patch Changes

- 936a0371: Add superseded_by column to policies table
- 936a0371: When publishing a new policy, update the superseded_by column for any policies it's superseding
- 42089b3f: removes mds-db from mds-policy

## 0.2.2

### Patch Changes

- b6802757: Updating mds-policy-service so mds-test-data not required to build, and moving some constants to mds-utils
- e6f408d4: fixes some test stability around random service ports
- Updated dependencies [b6802757]
  - @mds-core/mds-utils@0.1.34
  - @mds-core/mds-schema-validators@0.2.3
  - @mds-core/mds-geography-service@0.1.8
  - @mds-core/mds-repository@0.1.8
  - @mds-core/mds-service-helpers@0.3.1
  - @mds-core/mds-rpc-common@0.1.8

## 0.2.1

### Patch Changes

- e0860f5b: refactored mds-policy-author to use PolicyServiceClient instead of mds-db
- 6609400b: `vehicle_types` field in BaseRule should be restricted to `VEHICLE_TYPE[]`, not `string[]`
- Updated dependencies [e0860f5b]
- Updated dependencies [6609400b]
  - @mds-core/mds-service-helpers@0.3.0
  - @mds-core/mds-types@0.3.2
  - @mds-core/mds-rpc-common@0.1.7
  - @mds-core/mds-geography-service@0.1.7
  - @mds-core/mds-repository@0.1.7
  - @mds-core/mds-schema-validators@0.2.2
  - @mds-core/mds-utils@0.1.33

## 0.2.0

### Minor Changes

- 5eb4121b: Added policly queries and RPC methods for each query

### Patch Changes

- Updated dependencies [5eb4121b]
- Updated dependencies [5eb4121b]
- Updated dependencies [5eb4121b]
  - @mds-core/mds-service-helpers@0.2.0
  - @mds-core/mds-geography-service@0.1.6
  - @mds-core/mds-types@0.3.1
  - @mds-core/mds-rpc-common@0.1.6
  - @mds-core/mds-repository@0.1.6
  - @mds-core/mds-schema-validators@0.2.1
  - @mds-core/mds-utils@0.1.32

## 0.1.5

### Patch Changes

- 23c9c4a3: Migrated all mds-db/policies queries to typeORM
- Updated dependencies [24231359]
- Updated dependencies [93493a19]
  - @mds-core/mds-schema-validators@0.2.0
  - @mds-core/mds-types@0.3.0
  - @mds-core/mds-utils@0.1.31
  - @mds-core/mds-repository@0.1.5
  - @mds-core/mds-rpc-common@0.1.5
  - @mds-core/mds-service-helpers@0.1.5

## 0.1.4

### Patch Changes

- 8ab4569d: Minor patch change for every package to get versioning aligned with changeset workflows
- Updated dependencies [8ab4569d]
  - @mds-core/mds-repository@0.1.4
  - @mds-core/mds-rpc-common@0.1.4
  - @mds-core/mds-schema-validators@0.1.6
  - @mds-core/mds-service-helpers@0.1.4
  - @mds-core/mds-types@0.2.1
  - @mds-core/mds-utils@0.1.30

## 0.1.3

### Patch Changes

- Updated dependencies [cc0a3bae]
  - @mds-core/mds-types@0.2.0
  - @mds-core/mds-repository@0.1.3
  - @mds-core/mds-rpc-common@0.1.3
  - @mds-core/mds-schema-validators@0.1.5
  - @mds-core/mds-service-helpers@0.1.3
  - @mds-core/mds-utils@0.1.29
