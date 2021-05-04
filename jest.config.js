const { defaults } = require('jest-config');

module.exports = {
  transformIgnorePatterns: ['node_modules/(?!(fetch-run)/)'],
  setupFiles: ['./jest.setup.js'],

  moduleFileExtensions: [...defaults.moduleFileExtensions, 'native.js'],
};
