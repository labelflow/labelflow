/* eslint-disable import/first */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tools,
  useLabellingStore,
} from "../../../../connectors/labelling-state";
import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter();

import { DrawingTool } from "../drawing-tool";

describe("Drawing tool", () => {
  beforeEach(() => {
    useLabellingStore.setState({ isImageLoading: false });
    useLabellingStore.setState({ selectedTool: Tools.SELECTION });
  });

  it("should not be selected by default", () => {
    render(<DrawingTool />);

    expect(
      screen.getByRole("checkbox", { checked: false, name: "Drawing box tool" })
    ).toBeDefined();
  });

  it("should select the drawing bounding box tool", () => {
    render(<DrawingTool />);

    expect(screen.getByLabelText("Drawing box tool")).toBeDefined();

    userEvent.click(screen.getByLabelText("Drawing box tool"));
    expect(
      screen.getByRole("checkbox", { checked: true, name: "Drawing box tool" })
    ).toBeDefined();
  });

  it("should select the drawing polygon tool", () => {
    render(<DrawingTool />);

    userEvent.click(screen.getByLabelText("Change Drawing tool"));
    userEvent.click(screen.getByLabelText("Polygon tool"));

    expect(
      screen.getByRole("checkbox", {
        checked: true,
        name: "Drawing polygon tool",
      })
    ).toBeDefined();
  });
});
