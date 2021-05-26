export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  testMatch: ["<rootDir>/typescript/**/__tests__/**/*.{ts,tsx}"],
  testPathIgnorePatterns: ["node_modules"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
};
