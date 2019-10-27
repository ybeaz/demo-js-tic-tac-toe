// jest.config.js
// const {defaults} = require('jest-config');

const jestConfig = {
  verbose: true,
  testURL: "http://localhost/",
  'transform': {
    '^.+\\.(jsx|ts)?$': 'babel-jest',
  },
  testMatch: ['**/__tests__/*.(ts|js)?(x)'],
}

module.exports = jestConfig
