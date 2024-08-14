const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = createJestConfig({
  preset: 'ts-jest',
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": [ "ts-jest", { node: 'current' } ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
});