import {
  getNextClassColor,
  LABEL_CLASS_COLOR_PALETTE,
} from "./class-color-generator";

type TestCase = [string[], string];

const runTest = ([colors, expected]: TestCase) => {
  expect(getNextClassColor(colors)).toEqual(expected);
};

const TEST_CASES: Record<string, TestCase> = {
  "returns the first color if no color has been attributed": [
    [],
    LABEL_CLASS_COLOR_PALETTE[0],
  ],
  "returns the third color when the first 2 are passed in order": [
    LABEL_CLASS_COLOR_PALETTE.slice(0, 2),
    LABEL_CLASS_COLOR_PALETTE[2],
  ],
  "returns the third color even if the first two are not in order": [
    [LABEL_CLASS_COLOR_PALETTE[1], LABEL_CLASS_COLOR_PALETTE[0]],
    LABEL_CLASS_COLOR_PALETTE[2],
  ],
  "returns the first color if we pass only the second and the third": [
    LABEL_CLASS_COLOR_PALETTE.slice(1, 3),
    LABEL_CLASS_COLOR_PALETTE[0],
  ],
  "returns the first color if all colors have been attributed": [
    LABEL_CLASS_COLOR_PALETTE,
    LABEL_CLASS_COLOR_PALETTE[0],
  ],
  "returns the first color if all colors have been attributed, then second and third colors have been attributed again":
    [
      [...LABEL_CLASS_COLOR_PALETTE, ...LABEL_CLASS_COLOR_PALETTE.slice(1, 3)],
      LABEL_CLASS_COLOR_PALETTE[0],
    ],
};

describe(getNextClassColor, () => {
  it.concurrent.each(Object.entries(TEST_CASES))("%s", async (_, testCase) =>
    runTest(testCase)
  );
});
