export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  testMatch: ["<rootDir>/typescript/**/__tests__/**/*.{ts,tsx}"],
  testPathIgnorePatterns: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
  transform: {
    "\\.(gql|graphql)$": "jest-transform-graphql",
    "\\.[jt]sx?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!(ol)/)"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/jest/style-mock.js",
    "typeface-.*$": "<rootDir>/jest/style-mock.js",
  },
  setupFiles: ["jest-canvas-mock"],
};
