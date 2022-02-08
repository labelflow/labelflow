import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom/extend-expect";

import { KeymapModal } from "./keymap-modal";

const keymap = {
  goToPreviousImage: {
    key: "left",
    description: "Navigate to the previous image",
    category: "Navigation",
  },
};

describe(KeymapModal, () => {
  it("displays the key map and full text on hover", async () => {
    render(<KeymapModal keymap={keymap} isOpen onClose={() => {}} />);
    const arrowKey = screen.getByText(/←/i);
    expect(screen.queryAllByText(/left/i)).toHaveLength(0);
    userEvent.hover(arrowKey as HTMLElement);
    expect(await screen.findAllByText(/left/i)).toHaveLength(2);
    expect(screen.queryByText(/Navigation/i)).toBeInTheDocument();
  });
});
