import { render, screen } from "@testing-library/react";
import { ImportModal } from "../import-modal";

test("Should instanciate component", () => {
  render(<ImportModal />);

  expect(screen.getByText("Hello")).toBeDefined();
});
