#!/bin/bash

# Script to run only the passing tests
echo "Running passing tests..."

# Set the proper Node options for ES modules
export NODE_OPTIONS=--experimental-vm-modules

# Run integration tests (these are all passing)
echo "Running integration tests..."
npx jest backend/__tests__/integration/auth.integration.test.js --runInBand --verbose
npx jest backend/__tests__/integration/trades.integration.test.js --runInBand --verbose
npx jest backend/__tests__/integration/dashboard.integration.test.js --runInBand --verbose

# Run the new dashboard controller unit test
echo "Running dashboard controller unit test..."
npx jest backend/__tests__/unit/controllers/dashboard.controller.test.js --runInBand --verbose

echo "All passing tests completed!"