import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { DrawingToolbar } from "..";

test("should display tooltip", async () => {
  render(<DrawingToolbar />);

  const selectionToolButton = screen.queryByLabelText(/Select tool/i);

  expect(selectionToolButton).toBeInTheDocument();

  userEvent.hover(selectionToolButton as HTMLElement);

  await waitFor(() => expect(screen.getByText(/\[v\]/i)).toBeInTheDocument());

  expect(screen.queryByText(/Selection tool/i)).toBeInTheDocument();
});
