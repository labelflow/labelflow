import { isNilOrEmpty } from "@labelflow/utils";
import { render, fireEvent, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput, SearchInputProps } from "./search-input";

type RenderTestResult = RenderResult & {
  input: HTMLInputElement;
};

const renderTest = (props?: SearchInputProps): RenderTestResult => {
  const result = render(<SearchInput {...props} />);
  const { getByTestId, queryByTestId } = result;
  const input = getByTestId("search-input-value") as HTMLInputElement;
  expect(input.value).toBe(props?.value ?? "");
  if (isNilOrEmpty(props?.value)) {
    const clearButton = queryByTestId("search-input-clear-button");
    expect(clearButton).not.toBeInTheDocument();
  } else {
    const clearButton = getByTestId("search-input-clear-button");
    expect(clearButton).toBeVisible();
  }
  return { ...result, input };
};

describe("SearchInput", () => {
  it("displays the input correctly", () => {
    renderTest();
  });

  it("displays the value passed in props and a clear button", async () => {
    const { input } = renderTest({ value: "hello there" });
    expect(input.value).toBe("hello there");
  });

  it("displays the text typed in and clears it when clear button is clicked", async () => {
    const { input, getByTestId } = renderTest();
    userEvent.type(input, "hello there");
    expect(input.value).toBe("hello there");
    const clearButton = getByTestId("search-input-clear-button");
    expect(clearButton).toBeVisible();
    fireEvent.click(clearButton);
    expect(input.value.length).toBe(0);
  });
});
