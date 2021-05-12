export default {
  preset: "ts-jest",
  globals: {
    "ts-jest": { isolatedModules: true, diagnostics: false },
  },
  testEnvironment: "jsdom",
  collectCoverage: true,
  testMatch: ["<rootDir>/__tests__/**/*.{ts,tsx}"],
  testPathIgnorePatterns: ["node_modules"],
};
