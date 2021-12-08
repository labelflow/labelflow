export default {
  // preset: "ts-jest",
  // collectCoverage: true,
  // testPathIgnorePatterns: ["node_modules"],
  // setupFilesAfterEnv: ["<rootDir>/setup-tests.ts"],
  // globals: {
  //   "ts-jest": {
  //     tsconfig: "tsconfig.jest.json",
  //   },
  // },
  // transform: {
  //   "\\.(gql|graphql)$": "jest-transform-graphql",
  //   "\\.[jt]sx?$": "ts-jest",
  // },
  // transformIgnorePatterns: [
  //   "<rootDir>/node_modules/(?!(ol/|@mapbox/mapbox-gl-style-spec/|ol-mapbox-style/|fetch-blob/))",
  // ],
  // setupFiles: ["jest-canvas-mock"],
  projects: [
    {
      displayName: "browser",
      preset: "ts-jest",
      collectCoverage: true,
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
        "<rootDir>/node_modules/(?!(ol/|@mapbox/mapbox-gl-style-spec/|ol-mapbox-style/|fetch-blob/))",
      ],
      setupFiles: ["jest-canvas-mock"],
      testEnvironment: "jsdom",
      testMatch: [
        "<rootDir>/typescript/common-resolvers/**/__tests__/**/*.{ts,tsx}",
        "<rootDir>/typescript/react-openlayers-fiber/__tests__/**/*.{ts,tsx}",
        "<rootDir>/typescript/web/__tests__/**/*.{ts,tsx}",
      ],
    },
    {
      displayName: "nodejs",
      preset: "ts-jest",
      collectCoverage: true,
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
        "<rootDir>/node_modules/(?!(ol/|@mapbox/mapbox-gl-style-spec/|ol-mapbox-style/|fetch-blob/))",
      ],
      setupFiles: ["jest-canvas-mock"],
      testEnvironment: "node",
      testMatch: [
        "<rootDir>/typescript/db/**/__tests__/**/*.{ts,tsx}",
        "<rootDir>/typescript/common-resolvers/**/__tests__/**/*.{ts,tsx}",
      ],
    },
  ],
};
