import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { ClassListItem } from "./class-list-item";

const classDefault = {
  color: "#F59E0B",
  name: "someClass",
  shortcut: "myShortcut",
};
const classCreate = { type: "CreateClassItem", name: "nonExistingClass" };

describe(ClassListItem, () => {
  it("displays class name", () => {
    render(
      <ClassListItem
        highlight={false}
        index={0}
        item={classDefault}
        itemProps={{}}
      />
    );
    expect(screen.getByText(/someClass/i)).toBeDefined();
    expect(screen.queryByText(/Create class/i)).not.toBeInTheDocument();
    expect(screen.getByText(/myShortcut/i)).toBeDefined();
  });

  it("proposes to create class", () => {
    render(
      <ClassListItem
        highlight={false}
        index={0}
        item={classCreate}
        itemProps={{}}
        isCreateClassItem
      />
    );
    expect(screen.getByText(/nonExistingClass/i)).toBeDefined();
    expect(screen.getByText(/Create class/i)).toBeDefined();
  });
});
