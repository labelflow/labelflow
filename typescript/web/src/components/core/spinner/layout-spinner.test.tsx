import { render } from "@testing-library/react";
import { LayoutSpinner } from ".";
import { TestComponent, Wrapper } from "./layout-spinner.fixtures";

describe(LayoutSpinner, () => {
  it("is visible", () => {
    const { getByTestId } = render(<TestComponent />, { wrapper: Wrapper });
    const element = getByTestId("spinner");
    expect(element).toBeVisible();
  });
});
