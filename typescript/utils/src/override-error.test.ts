import { isEmpty } from "lodash/fp";
import {
  ErrorOverride,
  overrideError,
  withErrorOverrides,
  withErrorOverridesAsync,
} from ".";

type TestCase = [string | undefined, string | undefined];

const SPECIFIC_ERROR_MESSAGE = "Specific error to override";
const CUSTOM_ERROR_MESSAGE = "Custom error message";

const overrideSpecificError: ErrorOverride = (error) => {
  if (error instanceof Error && error.message === SPECIFIC_ERROR_MESSAGE) {
    throw new Error(CUSTOM_ERROR_MESSAGE);
  }
};

const ERROR_OVERRIDES: ErrorOverride[] = [overrideSpecificError];

const throwErrorIfDefined = (error: string | undefined): void => {
  if (isEmpty(error)) return;
  throw new Error(error);
};

const fn = (error: string | undefined) =>
  jest.fn(() => throwErrorIfDefined(error));

const fnAsync = (error: string | undefined) =>
  jest.fn(async () => throwErrorIfDefined(error));

const runTest = ([error, expected]: TestCase) => {
  const throwError = fn(error);
  const actual = withErrorOverrides(throwError, ERROR_OVERRIDES);
  if (!isEmpty(expected)) {
    expect(actual).toThrow(expected);
  }
};

const runAsyncTest = async ([error, expected]: TestCase) => {
  const throwError = fnAsync(error);
  const actual = withErrorOverridesAsync(throwError, ERROR_OVERRIDES);
  if (!isEmpty(expected)) {
    await expect(actual).rejects.toThrow(expected);
  }
};

const TEST_CASES: Record<string, TestCase> = {
  "throws a custom error if the override is matching": [
    SPECIFIC_ERROR_MESSAGE,
    CUSTOM_ERROR_MESSAGE,
  ],
  "throws the initial error if the override is not matching": [
    "Another message",
    "Another message",
  ],
  "does not throw any error if the specified function didn't fail": [
    undefined,
    undefined,
  ],
};

const TEST_CASES_ENTRIES = Object.entries(TEST_CASES).flatMap<
  [string, () => Promise<void>]
>(([description, testCase]) => [
  [`${description} (sync)`, async () => runTest(testCase)],
  [`${description} (async)`, async () => await runAsyncTest(testCase)],
]);

describe(overrideError, () => {
  it.concurrent.each(TEST_CASES_ENTRIES)("%s", async (_, exec) => await exec());
});
