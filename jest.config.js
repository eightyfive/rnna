// const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  transformIgnorePatterns: ['node_modules/(?!(fetch-run|@rnna/navigator)/)'],
  setupFiles: ['./jest.setup.js'],

  // moduleFileExtensions: [...defaults.moduleFileExtensions, 'native.js'],
};
