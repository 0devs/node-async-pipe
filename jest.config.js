module.exports = require('@0devs/package/config/jest.config');

module.exports.collectCoverage = false;

module.exports.collectCoverageFrom = ['src/**/*.ts'];

module.exports.moduleFileExtensions = [
  'ts',
  'tsx',
  'js',
];

module.exports.globals = {
  'ts-jest': {
    tsConfig: 'tsconfig.json',
  },
};

module.exports.testMatch = [
  '**/spec/unit/**/*.+(ts|js)',
  '**/spec/unit/*.+(ts|js)',
  '**/src/**/*.spec.ts',
];

module.exports.transform = {
  '^.+\\.(ts|tsx)$': 'ts-jest',
};

module.exports.transformIgnorePatterns = ["node_modules"];
