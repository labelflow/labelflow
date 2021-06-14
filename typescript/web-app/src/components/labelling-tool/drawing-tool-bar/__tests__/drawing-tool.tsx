import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DrawingTool } from "../drawing-tool";

jest.mock("next/router", () => {
  // @ts-ignore
  const router = {
    pathname: "/",
    query: {},
    replace: ({ pathname, query }: { pathname: any; query: any }) => {
      router.query = query;
      router.pathname = pathname;
    },
    useRouter: jest.fn(() => router),
  };
  return router;
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
