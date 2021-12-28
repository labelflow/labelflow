import { OptionalTextProps } from ".";

export type TestCase = [OptionalTextProps, string];

export const TEST_CASES: TestCase[] = [
  [{}, "<br>"],
  [{ text: "" }, "<br>"],
  [{ hideEmpty: true }, ""],
  [{ hideEmpty: false }, "<br>"],
  [{ text: "foo" }, "foo"],
  [{ text: "foo bar" }, "foo bar"],
  [{ text: " baz " }, " baz "],
  [{ error: "bar" }, "bar"],
  [{ text: "foo", error: "bar" }, "bar"],
  [{ text: "foo", error: "" }, "foo"],
];
