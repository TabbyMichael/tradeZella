export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/backend/**/*.test.js'],
};
