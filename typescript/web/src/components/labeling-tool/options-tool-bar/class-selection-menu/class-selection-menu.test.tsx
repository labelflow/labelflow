import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { mockMatchMedia } from "../../../../utils/mock-window";

mockMatchMedia(jest);

import { ClassSelectionMenu, LabelClassItem } from "./class-selection-menu";

const labelClasses = [
  {
    id: "coaisndoiasndi0",
    index: 0,
    createdAt: "today",
    updatedAt: "today",
    name: "Person",
    color: "#6B7280",
    shortcut: "1",
    labels: [],
  },
  {
    id: "coaisndoiasndi1",
    index: 1,
    createdAt: "today",
    updatedAt: "today",
    name: "Dog",
    color: "#EF4444 ",
    shortcut: "2",
    labels: [],
  },
];

const [onSelectedClassChange, createNewClass] = [jest.fn(), jest.fn()];
const setIsOpen = jest.fn();

const renderClassSelectionMenu = (
  labelClassesInput: LabelClassItem[],
  selectedLabelClass?: LabelClassItem,
  isOpen: boolean = false
): void => {
  render(
    <ClassSelectionMenu
      labelClasses={labelClassesInput}
      onSelectedClassChange={onSelectedClassChange}
      createNewClass={createNewClass}
      selectedLabelClass={selectedLabelClass}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
};

describe(ClassSelectionMenu, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders component", () => {
    renderClassSelectionMenu(labelClasses);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("renders with a selected label class", () => {
    renderClassSelectionMenu(labelClasses, labelClasses[0]);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("opens popover when clicking on the button", () => {
    renderClassSelectionMenu(labelClasses);
    expect(screen.getByRole("dialog", { hidden: true })).toBeDefined();
    userEvent.click(screen.getByRole("button"));
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  it("closes popover when clicking on a class", () => {
    renderClassSelectionMenu(labelClasses, undefined, true);
    userEvent.click(
      screen.getByRole("option", { name: RegExp(labelClasses[0].name) })
    );
    expect(onSelectedClassChange).toHaveBeenCalledWith(labelClasses[0]);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it("closes popover when creating a new class", () => {
    renderClassSelectionMenu(labelClasses, undefined, true);
    userEvent.type(screen.getByPlaceholderText(/search/i), "Perso");
    userEvent.click(screen.getByRole("option", { name: /Create class/ }));
    expect(createNewClass).toHaveBeenCalledWith("Perso");
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
