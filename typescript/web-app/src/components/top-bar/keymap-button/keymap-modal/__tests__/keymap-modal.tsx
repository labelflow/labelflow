import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom/extend-expect";

import { KeymapModal } from "../keymap-modal";

const keymap = {
  goToPreviousImage: {
    key: "left",
    description: "Navigate to the previous image",
    category: "Navigation",
  },
};

test("should display the key map and full text on hover", async () => {
  render(<KeymapModal keymap={keymap} isOpen onClose={() => {}} />);

  const arrowKey = screen.queryByText(/←/i);

  expect(arrowKey).toBeInTheDocument();

  userEvent.hover(arrowKey as HTMLElement);

  await waitFor(() => expect(screen.queryAllByText(/left/i)).toBeDefined());

  expect(screen.queryByText(/Navigation/i)).toBeInTheDocument();
});
