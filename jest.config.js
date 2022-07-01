// https://kulshekhar.github.io/ts-jest/docs/guides/react-native/

module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],

  transformIgnorePatterns: [
    'packages/rnna/node_modules/(?!(react-native-col)/)',
  ],
};
