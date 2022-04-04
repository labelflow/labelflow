import { Matcher, render } from "@testing-library/react";
import { ToggleButtonGroup } from ".";
import { TestComponent, TestOption } from "./toggle-button-group.fixtures";

type TestCase = [TestOption, TestOption];

const expectState = (
  getAllByTestId: (text: Matcher) => HTMLElement[],
  getByTestId: (text: Matcher) => HTMLElement,
  expectedValue: string
) => {
  const allInputs = getAllByTestId(/toggle button input/);
  allInputs.forEach((input) => {
    const value = input.getAttribute("value");
    const button = getByTestId(`toggle button ${value}`);
    if (value === expectedValue) {
      expect(button).toHaveAttribute("data-checked");
    } else {
      expect(button).not.toHaveAttribute("data-checked");
    }
  });
};

const runTest = async ([defaultValue, newValue]: TestCase) => {
  const { getByTestId, getAllByTestId } = render(
    <TestComponent defaultValue={defaultValue} />
  );
  expectState(getAllByTestId, getByTestId, defaultValue);
  const newValueButton = getByTestId(`toggle button ${newValue}`);
  newValueButton.click();
  expectState(getAllByTestId, getByTestId, newValue);
};

const TEST_CASES: Record<string, TestCase> = {
  "works with ToggleButton": ["optionA", "optionB"],
  "works with ToggleImageButton": ["optionA", "imageOptionC"],
};

describe(ToggleButtonGroup, () => {
  it.each(Object.entries(TEST_CASES))(
    "%s",
    async (_, testCase) => await runTest(testCase)
  );
});
