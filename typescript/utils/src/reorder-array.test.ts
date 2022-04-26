import { reorderArray } from "./reorder-array";

type TestCase = [string[], number, number, string[]];

const runTest = async ([array, source, destination, expected]: TestCase) => {
  const actual = reorderArray(array, source, destination);
  expect(actual).toEqual(expected);
};

const TEST_CASES: Record<string, TestCase> = {
  "reorders when moving up": [["a", "b", "c"], 1, 0, ["b", "a", "c"]],
  "reorders when moving down": [["a", "b", "c"], 1, 2, ["a", "c", "b"]],
};

describe(reorderArray, () => {
  it.concurrent.each(Object.entries(TEST_CASES))(
    "%s",
    async (_, testCase) => await runTest(testCase)
  );
});
