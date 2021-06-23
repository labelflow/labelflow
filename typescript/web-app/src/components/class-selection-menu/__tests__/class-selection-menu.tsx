import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { ClassSelectionMenu } from "../class-selection-menu";
import { LabelClass } from "../../../graphql-types.generated";

const labelClasses = [
  {
    id: "coaisndoiasndi0",
    createdAt: "today",
    updatedAt: "today",
    name: "Person",
    color: "#6B7280",
    shortcut: "1",
    labels: [],
  },
  {
    id: "coaisndoiasndi1",
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
  labelClassesInput: LabelClass[],
  selectedLabelClass?: LabelClass,
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

describe("Class selection popover tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Should render component", () => {
    renderClassSelectionMenu(labelClasses);

    expect(
      screen.getByRole("button", { name: "class-selection-menu-trigger" })
    ).toBeDefined();
  });

  test("Should render with a selected label class", () => {
    renderClassSelectionMenu(labelClasses, labelClasses[0]);

    expect(
      screen.getByRole("button", { name: "class-selection-menu-trigger" })
    ).toBeDefined();
  });

  test("Should open popover when clicking on the button", () => {
    renderClassSelectionMenu(labelClasses);

    expect(screen.getByRole("dialog", { hidden: true })).toBeDefined();
    userEvent.click(
      screen.getByRole("button", { name: "class-selection-menu-trigger" })
    );

    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  test("Should close popover when clicking on a class", () => {
    renderClassSelectionMenu(labelClasses, undefined, true);
    userEvent.click(
      screen.getByRole("option", { name: RegExp(labelClasses[0].name) })
    );

    expect(onSelectedClassChange).toHaveBeenCalledWith(labelClasses[0]);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("Should close popover when creating a new class", () => {
    renderClassSelectionMenu(labelClasses, undefined, true);
    userEvent.type(screen.getByPlaceholderText(/search/i), "Perso");
    userEvent.click(screen.getByRole("option", { name: /Create class/ }));

    expect(createNewClass).toHaveBeenCalledWith("Perso");
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
