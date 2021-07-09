export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  testMatch: ["<rootDir>/typescript/**/__tests__/**/*.{ts,tsx}"],
  testPathIgnorePatterns: ["node_modules"],
  setupFilesAfterEnv: ["<rootDir>/setup-tests.ts"],
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
  setupFiles: ["jest-canvas-mock"],
};
