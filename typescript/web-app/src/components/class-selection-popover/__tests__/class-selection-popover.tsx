import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { ClassSelectionPopover } from "../class-selection-popover";
import { LabelClass } from "../../../types.generated";

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
];

const [onClose, onSelectedClassChange, createNewClass] = [
  jest.fn(),
  jest.fn(),
  jest.fn(),
];

const renderClassSelectionPopover = (labelClassesInput: LabelClass[]): void => {
  render(
    <ClassSelectionPopover
      isOpen
      onClose={onClose}
      labelClasses={labelClassesInput}
      onSelectedClassChange={onSelectedClassChange}
      createNewClass={createNewClass}
    />
  );
};

describe("Class selection popover tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Should render component", () => {
    renderClassSelectionPopover(labelClasses);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  test("Should render no classes if none were given", () => {
    renderClassSelectionPopover([]);

    expect(screen.queryByText(/person/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/dog/i)).not.toBeInTheDocument();
  });

  test("Should render all classes in the list", () => {
    renderClassSelectionPopover(labelClasses);

    expect(screen.getByText(/person/i)).toBeInTheDocument();
    expect(screen.getByText(/dog/i)).toBeInTheDocument();
  });

  test("Should render matching classes with user search", async () => {
    renderClassSelectionPopover(labelClasses);
    userEvent.type(screen.getByPlaceholderText(/search/i), "Perso");

    expect(screen.getByText(/person/i)).toBeInTheDocument();
    expect(screen.queryByText(/dog/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Create class/)).toBeInTheDocument();
    expect(screen.getByText(/"Perso"/)).toBeInTheDocument();
  });

  test("Should call onSelectedClassChange when clicking on existing class", async () => {
    renderClassSelectionPopover(labelClasses);
    userEvent.click(screen.getByRole("option", { name: /Person/ }));

    expect(onSelectedClassChange).toHaveBeenCalledWith({
      id: "coaisndoiasndi",
      createdAt: "today",
      updatedAt: "today",
      labels: [],
      name: "Person",
      color: "#6B7280",
      shortcut: "1",
    });
  });

  test("Should call onSelectedClassChange when clicking on create new class", async () => {
    renderClassSelectionPopover(labelClasses);
    userEvent.type(screen.getByPlaceholderText(/search/i), "Perso");
    userEvent.click(screen.getByRole("option", { name: /Create class/ }));

    expect(createNewClass).toHaveBeenCalledWith("Perso");
  });
});
