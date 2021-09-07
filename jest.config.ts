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
  transformIgnorePatterns: [
    // "node_modules",
    // This one works but is extremely slow
    "<rootDir>/node_modules/(?!(ol/)|(@mapbox/mapbox-gl-style-spec))",
    //
    // "/node_modules/(?!(ol/|@mapbox/map))",
    // "<rootDir>/node_modules/.+(?!(\\.es\\..+))",
    //
    // "<rootDir>/node_modules/(?!(ol/))",
  ],
  setupFiles: ["jest-canvas-mock"],
};
