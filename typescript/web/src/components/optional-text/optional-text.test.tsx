import { render, screen } from "@testing-library/react";
import { v4 as uuid } from "uuid";
import { OptionalText, OptionalTextProps } from "./optional-text";
import { TEST_CASES } from "./optional-text.fixtures";

const runTest = async (
  props: OptionalTextProps,
  expected: string
): Promise<void> => {
  const id = uuid();
  render(<OptionalText aria-label={id} {...props} />);
  const element = screen.getByLabelText(id) as HTMLPreElement;
  expect(element.innerHTML).toBe(expected);
};

describe(OptionalText, () => {
  it.concurrent.each(TEST_CASES)("expects %p to return %p", runTest);
});
