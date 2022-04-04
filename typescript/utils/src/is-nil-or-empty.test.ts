import { isNilOrEmpty } from "./is-nil-or-empty";

type TestCase = [unknown, boolean];

const runTest = ([value, expected]: TestCase) => {
  expect(isNilOrEmpty(value)).toBe(expected);
};

const TEST_CASES: Record<string, TestCase> = {
  "returns true if the value is an empty string": ["", true],
  "returns true if the value is undefined": [undefined, true],
  "returns true if the value is null": [null, true],
  "returns false if the value is a non-empty array": [["foo"], false],
  "returns false if the value is a non-empty string": ["foo", false],
};

describe(isNilOrEmpty, () => {
  it.concurrent.each(Object.entries(TEST_CASES))(
    "%s",
    async (_title, testCase) => runTest(testCase)
  );
});
