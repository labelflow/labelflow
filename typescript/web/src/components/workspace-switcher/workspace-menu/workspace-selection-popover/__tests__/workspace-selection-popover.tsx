import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import {
  WorkspaceSelectionPopover,
  WorkspaceItem,
} from "../workspace-selection-popover";

const workspaces = [
  {
    id: "coaisndoiasndi1",
    slug: "labelflow",
    name: "LabelFlow",
    src: "https://labelflow.ai/static/icon-512x512.png",
  },
  {
    id: "coaisndoiasndi2",
    slug: "sterblue",
    name: "Sterblue",
    src: "https://labelflow.ai/static/img/sterblue-logo.png",
  },
];

const [onClose, onSelectedWorkspaceChange, createNewWorkspace] = [
  jest.fn(),
  jest.fn(),
  jest.fn(),
];

const renderWorkspaceSelectionPopover = (
  workspacesInput: WorkspaceItem[]
): void => {
  render(
    <WorkspaceSelectionPopover
      trigger={<div>Ok</div>}
      isOpen
      onClose={onClose}
      workspaces={workspacesInput}
      onSelectedWorkspaceChange={onSelectedWorkspaceChange}
      createNewWorkspace={createNewWorkspace}
    />
  );
};

describe("Class selection popover tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Should render component", () => {
    renderWorkspaceSelectionPopover(workspaces);

    expect(screen.getByPlaceholderText(/search/i)).toBeDefined();
  });

  test("Should render no workspaces if none were given", () => {
    renderWorkspaceSelectionPopover([]);

    expect(screen.queryByText(/Sterblue/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/LabelFlow/i)).not.toBeInTheDocument();
  });

  test("Should render all workspaces in the list", () => {
    renderWorkspaceSelectionPopover(workspaces);

    expect(screen.getByText(/Sterblue/i)).toBeDefined();
    expect(screen.getByText(/LabelFlow/i)).toBeDefined();
  });

  test("Should render matching workspaces with user search", async () => {
    renderWorkspaceSelectionPopover(workspaces);
    userEvent.type(screen.getByPlaceholderText(/search/i), "Labe");

    expect(screen.getByText(/LabelFlow/i)).toBeDefined();
    expect(screen.queryByText(/Sterblue/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Create workspace/)).toBeDefined();
    expect(screen.getByText(/"Labe"/)).toBeDefined();
  });

  test("Should call onSelectedWorkspaceChange when clicking on existing workspace", async () => {
    renderWorkspaceSelectionPopover(workspaces);
    userEvent.click(screen.getByRole("option", { name: /LabelFlow/ }));

    expect(onSelectedWorkspaceChange).toHaveBeenCalledWith({
      id: "coaisndoiasndi1",
      slug: "labelflow",
      name: "LabelFlow",
      src: "https://labelflow.ai/static/icon-512x512.png",
    });
  });

  test("Should call onSelectedWorkspaceChange when clicking on create new workspace", async () => {
    renderWorkspaceSelectionPopover(workspaces);
    userEvent.type(screen.getByPlaceholderText(/search/i), "Labe");
    userEvent.click(screen.getByRole("option", { name: /Create workspace/ }));

    expect(createNewWorkspace).toHaveBeenCalledWith("Labe");
  });
});
