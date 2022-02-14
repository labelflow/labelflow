import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ViewToolbar } from "./view-tool-bar";
import { useLabelingStore } from "../../../connectors/labeling-state";

describe(`${ViewToolbar.name} (zoom)`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays zoom in and out buttons", () => {
    render(<ViewToolbar containerRef={{ current: null }} />);
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeDefined();
  });

  it("disables zoom out by default", () => {
    render(<ViewToolbar containerRef={{ current: null }} />);
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeDisabled();
  });

  it("disables zoom in if image is at minimal resolution", async () => {
    render(<ViewToolbar containerRef={{ current: null }} />);
    await waitFor(() => useLabelingStore.setState({ canZoomIn: false }));
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeDisabled();
  });

  it("disables zoom out if image is at maximum resolution", async () => {
    useLabelingStore.setState({ canZoomOut: true });
    render(<ViewToolbar containerRef={{ current: null }} />);
    await waitFor(() => useLabelingStore.setState({ canZoomOut: false }));
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeDisabled();
  });

  useLabelingStore.setState({
    zoomByDelta: jest.fn(),
    setView: jest.fn(),
    zoomFactor: 0.6,
  });

  it("zooms out by a zoom factor", async () => {
    useLabelingStore.setState({ canZoomOut: true, isImageLoading: false });
    render(<ViewToolbar containerRef={{ current: null }} />);
    userEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    const state = useLabelingStore.getState();
    expect(state.zoomByDelta).toHaveBeenCalledWith(-state.zoomFactor);
  });

  it("zooms in by a zoom factor", async () => {
    useLabelingStore.setState({ canZoomIn: true, isImageLoading: false });
    render(<ViewToolbar containerRef={{ current: null }} />);
    userEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    const state = useLabelingStore.getState();
    expect(state.zoomByDelta).toHaveBeenCalledWith(state.zoomFactor);
  });
});
