export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  // testMatch: ["<rootDir>/typescript/**/__tests__/**/*.{ts,tsx}"], //TODO: set back the testMatch to this
  testMatch: ["<rootDir>/typescript/db/**/__tests__/**/*.{ts,tsx}"], // TODO: remove this line
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
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(ol/|@mapbox/mapbox-gl-style-spec/|ol-mapbox-style/))",
  ],
  setupFiles: ["jest-canvas-mock"],
};
