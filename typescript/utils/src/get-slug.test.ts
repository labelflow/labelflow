import { getSlug } from "./get-slug";

type TestCase = [string, string];

const TEST_CASES: TestCase[] = [
  ["", ""],
  ["foo", "foo"],
  ["foo", "Foo"],
  ["foo-bar", "foo Bar"],
  ["foo-bar-baz", " foo bar Baz "],
  ["e-and", "é & ^"],
  ["", "😈"],
];

describe(getSlug, () => {
  it.concurrent.each(TEST_CASES)(
    "returns %p if value is %p",
    async (expected, value) => expect(getSlug(value)).toBe(expected)
  );
});
