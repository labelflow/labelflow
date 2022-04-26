import { fireEvent, render, screen } from "@testing-library/react";
import { LabelClassesTableRow } from "./label-classes-table-row";
import {
  TestComponent,
  TEST_DATA,
  Wrapper,
} from "./label-classes-table-row.fixtures";

const setEditClass = jest.fn();
const setDeleteClassId = jest.fn();

const renderTestComponent = () => {
  return render(
    <TestComponent
      setEditClass={setEditClass}
      setDeleteClassId={setDeleteClassId}
    />,
    { wrapper: Wrapper }
  );
};

describe(LabelClassesTableRow, () => {
  beforeEach(() => {
    setEditClass.mockReset();
    setDeleteClassId.mockReset();
  });

  it("displays a class with the possibility to reorder, edit and delete it", () => {
    renderTestComponent();
    expect(screen.getByText(/Horse/i)).toBeDefined();
    expect(
      screen.getByRole("button", { name: "move row handle" })
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Edit class" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Delete class" })).toBeDefined();
    expect(screen.getByText(/myShortcut/i)).toBeDefined();
  });

  it("calls function to edit name when edit button is clicked", async () => {
    renderTestComponent();
    fireEvent.click(screen.getByRole("button", { name: "Edit class" }));
    expect(setEditClass).toHaveBeenCalledWith(TEST_DATA);
  });

  it("calls function to delete name when delete button is clicked", async () => {
    renderTestComponent();
    fireEvent.click(screen.getByRole("button", { name: "Delete class" }));
    expect(setDeleteClassId).toHaveBeenCalledWith("myClassId");
  });
});
