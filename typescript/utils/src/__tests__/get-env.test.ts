import { getEnv } from "..";

type TestCaseArgs = Parameters<typeof getEnv>;

type TestCaseExpectation = { throws: string } | { returns: string };

type TestCase = [TestCaseArgs, TestCaseExpectation];

const runTest = ([args, expected]: TestCase) => {
  if ("throws" in expected) {
    expect(() => getEnv(...args)).toThrow(expected.throws);
  } else {
    const actual = getEnv(...args);
    expect(actual).toEqual(expected.returns);
  }
};

const TEST_CASES: Record<string, TestCase> = {
  "Should return value if defined": [["NODE_ENV"], { returns: "test" }],
  "Should return value if defined and default value is defined too": [
    ["NODE_ENV", "foo"],
    { returns: "test" },
  ],
  "Should default value if defined and value is unavailable": [
    ["6dca974a-f1b7-4b8b-8f06-d6985730050b"],
    {
      throws:
        "Environment variable 6dca974a-f1b7-4b8b-8f06-d6985730050b is required",
    },
  ],
};

describe("getEnv", () => {
  it.concurrent.each(Object.entries(TEST_CASES))("%s", async (_, testCase) => {
    runTest(testCase);
  });
});
