#!/bin/bash

# Script to run all tests in the TradeZella project
# This includes frontend and backend tests of all types

echo "========================================="
echo "  TradeZella - Complete Test Suite Runner"
echo "========================================="
echo ""

# Set the proper Node options for ES modules
export NODE_OPTIONS=--experimental-vm-modules

# Track test results
TOTAL_SUITES=0
PASSED_SUITES=0

# Function to run a test suite and track results
run_test_suite() {
    local suite_name=$1
    local command=$2
    
    echo "------------------------------"
    echo "Running: $suite_name"
    echo "Command: $command"
    echo "------------------------------"
    
    # Run the test command
    if eval $command; then
        echo "✅ $suite_name: PASSED"
        PASSED_SUITES=$((PASSED_SUITES + 1))
    else
        echo "❌ $suite_name: FAILED"
    fi
    
    TOTAL_SUITES=$((TOTAL_SUITES + 1))
    echo ""
}

# Run backend tests
echo "🚀 Running Backend Tests"
echo ""

# Run all backend unit tests
run_test_suite "Backend Unit Tests" "cd backend && npm run test:unit"

# Run all backend integration tests
run_test_suite "Backend Integration Tests" "cd backend && npm run test:integration"

# Run all backend E2E tests
run_test_suite "Backend E2E Tests" "cd backend && npm run test:e2e"

# Run frontend tests (if any)
echo "🎨 Running Frontend Tests"
echo ""

# Run frontend unit tests
run_test_suite "Frontend Unit Tests" "npm run test:unit"

# Run frontend integration tests
run_test_suite "Frontend Integration Tests" "npm run test:integration"

# Run frontend E2E tests
run_test_suite "Frontend E2E Tests" "npm run test:e2e"

# Summary
echo "========================================="
echo "           TEST RESULTS SUMMARY"
echo "========================================="
echo "Total test suites: $TOTAL_SUITES"
echo "Passed test suites: $PASSED_SUITES"
echo "Failed test suites: $((TOTAL_SUITES - PASSED_SUITES))"

if [ $PASSED_SUITES -eq $TOTAL_SUITES ]; then
    echo ""
    echo "🎉 ALL TESTS PASSED!"
    exit 0
else
    echo ""
    echo "⚠️  SOME TESTS FAILED"
    exit 1
fi