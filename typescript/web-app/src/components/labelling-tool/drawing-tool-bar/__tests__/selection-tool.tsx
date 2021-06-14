import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectionTool } from "../selection-tool";

describe("Selection tool", () => {
  it("should be selected by default", () => {
    render(<SelectionTool />);

    expect(screen.getByRole("checkbox", { checked: true })).toBeDefined();
  });

  it("should select the bounding box when pressing the 'b' key is pressed", () => {
    const { container } = render(
      <>
        <SelectionTool />
        <input type="checkbox" />
      </>
    );

    userEvent.tab();
    expect(screen.getByRole("checkbox", { checked: false })).toBeDefined();

    userEvent.type(container, "{v}");

    expect(screen.getByRole("checkbox", { checked: true })).toBeDefined();
  });
});
