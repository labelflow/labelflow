import { isEnumValue } from "./is-enum-value";
import { toEnumValue } from "./to-enum-value";

enum TestEnum {
  Foo = "Foo",
  Bar = "Bar",
}

type TestCase = TestEnum | [TestEnum | string | undefined | null, string];

const EMPTY_ERROR = "Enum value is empty";

const TEST_CASES: Record<string, TestCase> = {
  "returns the enum value when it exists": TestEnum.Bar,
  "throws an error when input does not exist": [
    "Baz",
    'Enum value "Baz" does not exist',
  ],
  "throws an error when input is empty": ["", EMPTY_ERROR],
  "throws an error when input undefined": [undefined, EMPTY_ERROR],
  "throws an error when input null": [null, EMPTY_ERROR],
  "returns the default value if any when input is empty": ["", TestEnum.Foo],
  "returns the default value if any when input undefined": [
    undefined,
    TestEnum.Foo,
  ],
  "returns the default value if any when input null": [null, TestEnum.Foo],
};

const runTest = (testCase: TestCase): void => {
  if (typeof testCase === "string") {
    expect(toEnumValue(TestEnum, testCase)).toBe(testCase);
    return;
  }
  const [value, expectedValueOrError] = testCase;
  if (isEnumValue(TestEnum, expectedValueOrError)) {
    expect(toEnumValue(TestEnum, value, expectedValueOrError)).toBe(
      expectedValueOrError
    );
  } else {
    expect(() => toEnumValue(TestEnum, value)).toThrowError(
      expectedValueOrError
    );
  }
};

describe(toEnumValue, () => {
  it.concurrent.each(Object.entries(TEST_CASES))(
    "%s",
    async (_title, testCase) => runTest(testCase)
  );
});
