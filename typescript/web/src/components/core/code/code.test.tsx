import { fireEvent, render, RenderResult } from "@testing-library/react";
import { Code } from ".";
import { SINGLE_LINE_CODE_EXAMPLE } from "./code.fixtures";

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const renderAndHover = (inline?: boolean): [RenderResult, HTMLElement] => {
  const renderResult = render(
    <Code {...SINGLE_LINE_CODE_EXAMPLE} inline={inline} />
  );
  const { getByTestId, queryByTestId } = renderResult;
  expect(queryByTestId("copy-code-button")).not.toBeInTheDocument();
  const box = getByTestId("code-box");
  fireEvent.mouseEnter(box);
  return [renderResult, box];
};

describe("Code", () => {
  it("can copy code into clipboard", () => {
    const [{ getByTestId, queryByTestId }, box] = renderAndHover();
    expect(queryByTestId("copy-code-button")).toBeInTheDocument();
    fireEvent.click(getByTestId("copy-code-button"));
    expect(navigator.clipboard.writeText).toHaveBeenNthCalledWith(
      1,
      SINGLE_LINE_CODE_EXAMPLE.children
    );
    fireEvent.mouseLeave(box);
    expect(queryByTestId("copy-code-button")).not.toBeInTheDocument();
  });

  it("doesn't show the copy button if inline is true", () => {
    const [{ queryByTestId }] = renderAndHover(true);
    expect(queryByTestId("copy-code-button")).not.toBeInTheDocument();
  });
});
