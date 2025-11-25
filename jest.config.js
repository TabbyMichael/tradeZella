export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: './jest.environment.js',
  testMatch: [
    '**/__tests__/unit/**/*.test.js',
    '**/__tests__/integration/**/*.test.js',
    '**/__tests__/e2e/**/*.test.js',
    '**/backend/**/*.test.js'
  ],
  collectCoverageFrom: [
    'backend/src/**/*.js',
    '!backend/src/index.js',
    '!backend/src/db.js',
    '!backend/src/migrations/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000
};