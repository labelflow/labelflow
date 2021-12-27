import { render, screen } from "@testing-library/react";
import { v4 as uuid } from "uuid";
import { OptionalText, OptionalTextProps } from "../optional-text";

type TestCase = [OptionalTextProps, string];

const runTest = async (
  props: OptionalTextProps,
  expected: string
): Promise<void> => {
  const id = uuid();
  render(<OptionalText aria-label={id} {...props} />);
  const element = screen.getByLabelText(id) as HTMLPreElement;
  expect(element.innerHTML).toBe(expected);
};

const TEST_CASES: TestCase[] = [
  [{ text: undefined }, ""],
  [{ text: "" }, ""],
  [{ text: "foo" }, "foo"],
  [{ text: "foo bar" }, "foo bar"],
  [{ text: " baz " }, " baz "],
  [{ error: "bar" }, "bar"],
  [{ text: "foo", error: "bar" }, "bar"],
  [{ text: "foo", error: "" }, "foo"],
  [{}, ""],
];

describe("OptionalText", () => {
  it.concurrent.each(TEST_CASES)("%p => %p", runTest);
});
