import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DrawingTool } from "../drawing-tool";

jest.mock("next/router", () => {
  let globalQuery = {};
  let globalPathname = "/";
  return {
    pathname: globalPathname,
    query: globalQuery,
    replace: ({ pathname, query }: { pathname: any; query: any }) => {
      globalQuery = query;
      globalPathname = pathname;
    },
  };
});

describe("Drawing tool", () => {
  it("should not be selected by default", () => {
    render(<DrawingTool />);

    expect(screen.getByRole("checkbox", { checked: false })).toBeDefined();
  });

  it("should select the drawing bounding box tool", () => {
    render(<DrawingTool />);

    userEvent.click(screen.getByRole("checkbox", { checked: false }));

    expect(screen.getByRole("checkbox", { checked: true })).toBeDefined();
  });
});
