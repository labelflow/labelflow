import { render } from "@testing-library/react";
import { Spinner } from ".";

describe(Spinner, () => {
  it("is visible", () => {
    const { getByTestId } = render(<Spinner data-testid="spinner" />);
    const element = getByTestId("spinner");
    expect(element).toBeVisible();
  });
});
