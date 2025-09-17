const NodeEnvironment = require('jest-environment-node').default;
const dotenv = require('dotenv');

module.exports = class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    dotenv.config({ path: './.env' });
  }
};
