/* eslint-disable import/first */
import "@testing-library/jest-dom/extend-expect";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLabelingStore } from "../../../connectors/labeling-state";
import { mockNextRouter } from "../../../utils/tests/router-mocks";

mockNextRouter();

import { DrawingToolbar } from ".";

describe(DrawingToolbar, () => {
  it("displays tooltip", async () => {
    useLabelingStore.setState({ isImageLoading: false });
    render(<DrawingToolbar />);
    const selectionToolButton = screen.getByLabelText(/Selection tool/i);
    userEvent.hover(selectionToolButton as HTMLElement);
    await waitFor(() => expect(screen.getByText(/\[v\]/i)).toBeInTheDocument());
    expect(screen.queryByText(/Selection tool/i)).toBeInTheDocument();
  });
});
