export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  testMatch: ["<rootDir>/**/__tests__/**/*.{ts,tsx}"],
  testPathIgnorePatterns: ["node_modules"],
};
