import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { WorkspaceListItem } from "../workspace-list-item";

test("should display class name", () => {
  render(
    <WorkspaceListItem
      highlight
      index={0}
      item={{
        src: "https://labelflow.ai/static/icon-512x512.png",
        name: "My Workspace",
      }}
      itemProps={{}}
    />
  );
  expect(screen.getByText(/My Workspace/i)).toBeDefined();
  expect(screen.queryByText(/Create workspace/i)).not.toBeInTheDocument();
});

test("should propose to create class", () => {
  render(
    <WorkspaceListItem
      highlight
      index={0}
      item={{ name: "My New Workspace" }}
      isCreateWorkspaceItem
      itemProps={{}}
    />
  );
  expect(screen.getByText(/My New Workspace/i)).toBeDefined();
  expect(screen.getByText(/Create workspace/i)).toBeDefined();
});
