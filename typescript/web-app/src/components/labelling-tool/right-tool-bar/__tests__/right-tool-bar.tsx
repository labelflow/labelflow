import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RightToolbar } from "../right-tool-bar";
import { useLabellingStore } from "../../../../connectors/labelling-state";
import { LabellingContext } from "../../labelling-context";

beforeEach(() => {
  jest.clearAllMocks();
});

it("should display zoom in and out buttons", () => {
  render(<RightToolbar />);

  expect(screen.getByRole("button", { name: "Zoom out" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Zoom in" })).toBeDefined();
});

it("should disable zoom out by default", () => {
  render(<RightToolbar />);

  expect(screen.getByRole("button", { name: "Zoom out" })).toBeDisabled();
});

it("should disable zoom in if image is at minimal resolution", async () => {
  render(<RightToolbar />);

  await waitFor(() => {
    useLabellingStore.setState({ canZoomIn: false });
  });

  expect(screen.getByRole("button", { name: "Zoom in" })).toBeDisabled();
});

it("should disable zoom out if image is at maximum resolution", async () => {
  useLabellingStore.setState({ canZoomOut: true });
  render(<RightToolbar />);

  await waitFor(() => {
    useLabellingStore.setState({ canZoomOut: false });
  });

  expect(screen.getByRole("button", { name: "Zoom out" })).toBeDisabled();
});

const contextValue = {
  zoomByDelta: jest.fn(),
  setView: jest.fn(),
  zoomFactor: 0.6,
};

it("should zoom out by a zoom factor", async () => {
  useLabellingStore.setState({ canZoomOut: true });
  render(<RightToolbar />, {
    wrapper: ({ children }) => (
      <LabellingContext.Provider value={contextValue}>
        {children}
      </LabellingContext.Provider>
    ),
  });

  userEvent.click(screen.getByRole("button", { name: "Zoom out" }));

  expect(contextValue.zoomByDelta).toHaveBeenCalledWith(
    -contextValue.zoomFactor
  );
});

it("should zoom in by a zoom factor", async () => {
  useLabellingStore.setState({ canZoomIn: true });
  render(<RightToolbar />, {
    wrapper: ({ children }) => (
      <LabellingContext.Provider value={contextValue}>
        {children}
      </LabellingContext.Provider>
    ),
  });

  userEvent.click(screen.getByRole("button", { name: "Zoom in" }));

  expect(contextValue.zoomByDelta).toHaveBeenCalledWith(
    contextValue.zoomFactor
  );
});
