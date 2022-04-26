export default {
  projects: [
    {
      displayName: "browser",
      preset: "ts-jest",
      collectCoverage: true,
      coverageReporters: ["lcov"],
      testPathIgnorePatterns: ["node_modules"],
      setupFilesAfterEnv: ["<rootDir>/setup-tests.ts"],
      globals: {
        "ts-jest": {
          tsconfig: "tsconfig.jest.json",
          isolatedModules: true,
        },
      },
      transform: {
        "\\.(gql|graphql)$": "jest-transform-graphql",
        "\\.[jt]sx?$": "ts-jest",
      },
      transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!(ol/|@mapbox/mapbox-gl-style-spec/|ol-mapbox-style/|fetch-blob/))",
      ],
      setupFiles: ["jest-canvas-mock"],
      testEnvironment: "jsdom",
      testMatch: [
        "<rootDir>/typescript/(react-openlayers-fiber|web)/src/**/(*.)+test.{ts,tsx}",
      ],
      moduleNameMapper: {
        "\\.svg$":
          "<rootDir>/typescript/web/src/utils/tests/react-svgr-mock.ts",
      },
    },
    {
      displayName: "nodejs",
      preset: "ts-jest",
      collectCoverage: true,
      coverageReporters: ["lcov"],
      testPathIgnorePatterns: ["node_modules"],
      setupFilesAfterEnv: ["<rootDir>/setup-tests.ts"],
      globals: {
        "ts-jest": {
          tsconfig: "tsconfig.jest.json",
          isolatedModules: true,
        },
      },
      transform: {
        "\\.(gql|graphql)$": "jest-transform-graphql",
        "\\.[jt]sx?$": "ts-jest",
      },
      transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!(ol/|@mapbox/mapbox-gl-style-spec/|ol-mapbox-style/|fetch-blob/))",
      ],
      setupFiles: ["jest-canvas-mock"],
      testEnvironment: "node",
      testMatch: [
        "<rootDir>/typescript/(common-resolvers|db|utils)/src/**/(*.)+test.{ts,tsx}",
      ],
    },
  ],
};
