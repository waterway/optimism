# @eth-optimism/batch-submitter-service

## 0.1.6

### Patch Changes

- 6af67df5: Move L2 dial logic out of bss-core to avoid l2geth dependency
- fe680568: Enable the usage of typed batches and type 0 zlib compressed batches

## 0.1.5

### Patch Changes

- 6f2ea193: Update to go-ethereum v1.10.16
- 87359fd2: Refactors the bss-core service to use a metrics interface to allow
  driver-specific metric extensions

## 0.1.4

### Patch Changes

- bcbde5f3: Fixes a bug that causes the txmgr to not wait for the configured numConfirmations

## 0.1.3

### Patch Changes

- 69118ac3: Switch num_elements_per_batch from Histogram to Summary
- df98d134: Remove extra space in metric names
- 3ec06301: Default to JSON logs, add LOG_TERMINAL flag for debugging
- fe321618: Unify metric name format
- 93a26819: Fixes a bug where clearing txs are rejected on startup due to missing gas limit

## 0.1.2

### Patch Changes

- c775ffbe: fix BSS log-level flag parsing
- d093a6bb: Adds a fix for the BSS to account for the new timestamp logic in L2Geth
- d4c2e01b: Restructure to use bss-core package

## 0.1.1

### Patch Changes

- 5905f3dc: Update golang version to support HTTP/2
- c1eba2e6: use EIP-1559 txns for tx/state batches

## 0.1.0

### Minor Changes

- 356b7271: Add multi-tx support, clear pending txs on startup

### Patch Changes

- 85aa148d: Adds confirmation depth awareness to txmgr

## 0.0.2

### Patch Changes

- d6e0de5a: Fix metrics server
