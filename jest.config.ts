export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  testMatch: ["<rootDir>/typescript/**/__tests__/**/*.{ts,tsx}"],
  testPathIgnorePatterns: [
    "node_modules",
    "<rootDir>/typescript/db/src/resolvers/__tests__/*.ts",
  ],
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
