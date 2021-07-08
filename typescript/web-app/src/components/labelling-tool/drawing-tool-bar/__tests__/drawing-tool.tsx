/* eslint-disable import/first */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLabellingStore } from "../../../../connectors/labelling-state";
import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter();

import { DrawingTool } from "../drawing-tool";

describe("Drawing tool", () => {
  beforeEach(() => {
    useLabellingStore.setState({ isImageLoading: false });
  });

  it("should not be selected by default", () => {
    render(<DrawingTool />);

    expect(screen.getByRole("checkbox", { checked: false })).toBeDefined();
  });

  it("should select the drawing bounding box tool", () => {
    render(<DrawingTool />);

    userEvent.click(screen.getByRole("checkbox", { checked: false }));

    expect(screen.getByRole("checkbox", { checked: true })).toBeDefined();
  });

  it("should select the bounding box when pressing the 'b' key is pressed", () => {
    const { container } = render(<DrawingTool />);

    userEvent.type(container, "{b}");

    expect(screen.getByRole("checkbox", { checked: true })).toBeDefined();
  });
});
