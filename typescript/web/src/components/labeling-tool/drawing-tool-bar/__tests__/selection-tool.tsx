import { render, screen } from "@testing-library/react";
import { mockNextRouter } from "../../../../utils/tests";

mockNextRouter();

import { SelectionTool } from "../selection-tool";

describe("Selection tool", () => {
  it("should be selected by default", () => {
    render(<SelectionTool />);

    expect(screen.getByRole("checkbox", { checked: true })).toBeDefined();
  });
});
