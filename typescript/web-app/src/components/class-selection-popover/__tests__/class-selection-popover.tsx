import { render, screen } from "@testing-library/react";
import { ClassSelectionPopover } from "../class-selection-popover";
import "@testing-library/jest-dom/extend-expect";

const labelClasses = [
  {
    id: "coaisndoiasndi",
    createdAt: "today",
    updatedAt: "today",
    labels: [],
    name: "Person",
    color: "#6B7280",
    shortcut: "1",
  },
  {
    id: "coaisndoiasndia",
    createdAt: "today",
    updatedAt: "today",
    labels: [],
    name: "Dog",
    color: "#EF4444 ",
    shortcut: "2",
  },
  {
    id: "coaisndoiasndis",
    createdAt: "today",
    updatedAt: "today",
    labels: [],
    name: "Car",
    color: "#F59E0B",
    shortcut: "3",
  },
  {
    id: "coaisndoiasndid",
    createdAt: "today",
    updatedAt: "today",
    labels: [],
    name: "Cycle",
    color: "#10B981",
    shortcut: "4",
  },
  {
    id: "coaisndoiasndiq",
    createdAt: "today",
    updatedAt: "today",
    labels: [],
    name: "Plane",
    color: "#3B82F6",
    shortcut: "5",
  },
];

test("Should render component", () => {
  render(
    <ClassSelectionPopover
      isOpen
      onClose={jest.fn()}
      labelClasses={labelClasses}
      onSelectedClassChange={console.log}
      createNewClass={jest.fn()}
    />
  );
  expect(screen.queryByPlaceholderText(/search/i)).toBeInTheDocument();
});
