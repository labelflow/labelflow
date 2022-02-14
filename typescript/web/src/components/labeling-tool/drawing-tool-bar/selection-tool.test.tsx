import { render, screen } from "@testing-library/react";
import { mockNextRouter } from "../../../utils/tests";

mockNextRouter();

import { SelectionTool } from "./selection-tool";

describe(SelectionTool, () => {
  it("is selected by default", () => {
    render(<SelectionTool />);
    expect(screen.getByRole("checkbox", { checked: true })).toBeDefined();
  });
});
