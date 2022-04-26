import { isEnumValue } from "./is-enum-value";

enum TestEnum {
  Foo = "Foo",
  Bar = "Bar",
}

type TestCase = [string | undefined | null, boolean];

const TEST_CASES: Record<string, TestCase> = {
  "returns true if the value exists": [TestEnum.Bar, true],
  "returns true if the value does not exists": ["Baz", false],
  "returns true if the value is empty": ["", false],
  "returns true if the value undefined": [undefined, false],
  "returns true if the value null": [null, false],
};

const runTest = ([value, expected]: TestCase): void => {
  expect(isEnumValue(TestEnum, value)).toBe(expected);
};

describe(isEnumValue, () => {
  it.concurrent.each(Object.entries(TEST_CASES))(
    "%s",
    async (_title, testCase) => runTest(testCase)
  );
});
