import { render, screen } from "@testing-library/react";

import { SelectionTool } from "../selection-tool";

jest.mock("next/router", () => ({
  query: {},
}));

describe("Selection tool", () => {
  it("should be selected by default", () => {
    render(<SelectionTool />);

    expect(screen.getByRole("checkbox", { checked: true })).toBeDefined();
  });
});
