#!/bin/bash

set -e

RETRIES=${RETRIES:-60}

# waits for l2geth to be up
curl \
    --fail \
    --show-error \
    --silent \
    --output /dev/null \
    --retry-connrefused \
    --retry $RETRIES \
    --retry-delay 1 \
    $MESSAGE_RELAYER__L2RPCPROVIDER

# go
exec yarn start
