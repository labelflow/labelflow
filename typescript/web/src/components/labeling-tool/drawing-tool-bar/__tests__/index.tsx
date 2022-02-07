/* eslint-disable import/first */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { mockNextRouter } from "../../../../utils/router-mocks";
import { useLabelingStore } from "../../../../connectors/labeling-state";

mockNextRouter();

import { DrawingToolbar } from "..";

test("should display tooltip", async () => {
  useLabelingStore.setState({ isImageLoading: false });

  render(<DrawingToolbar />);

  const selectionToolButton = await screen.getByLabelText(/Selection tool/i);

  userEvent.hover(selectionToolButton as HTMLElement);

  await waitFor(() => expect(screen.getByText(/\[v\]/i)).toBeInTheDocument());

  expect(screen.queryByText(/Selection tool/i)).toBeInTheDocument();
});
