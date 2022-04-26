import { render } from "@testing-library/react";
import {
  DND_DIRECTION_DOWN,
  makeDnd,
  mockDndSpacing,
  mockGetComputedStyle,
} from "react-beautiful-dnd-test-utils";
import { TestComponent } from "./reorderable-table.fixtures";

const onReorder = jest.fn();

const renderTest = () => {
  const element = render(<TestComponent onReorder={onReorder} />);
  mockDndSpacing(element.container);
  return element;
};

describe("ReorderableTable", () => {
  beforeEach(() => {
    onReorder.mockReset();
    mockGetComputedStyle();
  });

  it("calls onReorder when moving a row inside a droppable", async () => {
    const { getAllByTestId } = renderTest();
    await makeDnd({
      getDragElement: () => getAllByTestId(/handle/)[0],
      direction: DND_DIRECTION_DOWN,
      positions: 1,
    });
    expect(onReorder).toHaveBeenCalledWith("0", 0, 1);
  });
});
