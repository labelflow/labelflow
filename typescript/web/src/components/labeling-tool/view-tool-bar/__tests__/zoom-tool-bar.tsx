import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ViewToolbar } from "../view-tool-bar";
import { useLabelingStore } from "../../../../connectors/labeling-state";

beforeEach(() => {
  jest.clearAllMocks();
});

it("should display zoom in and out buttons", () => {
  render(<ViewToolbar containerRef={{ current: null }} />);

  expect(screen.getByRole("button", { name: "Zoom out" })).toBeDefined();
  expect(screen.getByRole("button", { name: "Zoom in" })).toBeDefined();
});

it("should disable zoom out by default", () => {
  render(<ViewToolbar containerRef={{ current: null }} />);

  expect(screen.getByRole("button", { name: "Zoom out" })).toBeDisabled();
});

it("should disable zoom in if image is at minimal resolution", async () => {
  render(<ViewToolbar containerRef={{ current: null }} />);

  await waitFor(() => {
    useLabelingStore.setState({ canZoomIn: false });
  });

  expect(screen.getByRole("button", { name: "Zoom in" })).toBeDisabled();
});

it("should disable zoom out if image is at maximum resolution", async () => {
  useLabelingStore.setState({ canZoomOut: true });
  render(<ViewToolbar containerRef={{ current: null }} />);

  await waitFor(() => {
    useLabelingStore.setState({ canZoomOut: false });
  });

  expect(screen.getByRole("button", { name: "Zoom out" })).toBeDisabled();
});

useLabelingStore.setState({
  zoomByDelta: jest.fn(),
  setView: jest.fn(),
  zoomFactor: 0.6,
});

it("should zoom out by a zoom factor", async () => {
  useLabelingStore.setState({ canZoomOut: true });
  render(<ViewToolbar containerRef={{ current: null }} />);

  userEvent.click(screen.getByRole("button", { name: "Zoom out" }));

  const state = useLabelingStore.getState();
  expect(state.zoomByDelta).toHaveBeenCalledWith(-state.zoomFactor);
});

it("should zoom in by a zoom factor", async () => {
  useLabelingStore.setState({ canZoomIn: true });
  render(<ViewToolbar containerRef={{ current: null }} />);

  userEvent.click(screen.getByRole("button", { name: "Zoom in" }));

  const state = useLabelingStore.getState();
  expect(state.zoomByDelta).toHaveBeenCalledWith(state.zoomFactor);
});
