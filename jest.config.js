export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: './jest.environment.js',
  testMatch: ['**/backend/**/*.test.js'],
};
