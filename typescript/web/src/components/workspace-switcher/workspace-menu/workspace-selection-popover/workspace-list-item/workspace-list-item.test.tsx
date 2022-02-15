import "@testing-library/jest-dom/extend-expect";
import { ReactElement } from "react";
import { waitFor } from "@testing-library/react";

import { mockWorkspace } from "../../../../../utils/tests/mock-workspace";

mockWorkspace();

import { WORKSPACE_DATA } from "../../../../../utils/fixtures";
import { renderWithTestWrapper } from "../../../../../utils/tests";
import { WorkspaceListItem } from "./workspace-list-item";

const renderTest = async (element: ReactElement) =>
  await renderWithTestWrapper(element, {
    auth: { withWorkspaces: true },
    apollo: true,
  });

const NEW_WORKSPACE_NAME = "My New Workspace";

describe(WorkspaceListItem, () => {
  it("only displays workspace name when it exists", async () => {
    const { getByText, queryByText } = await renderTest(
      <WorkspaceListItem
        highlight
        index={0}
        item={WORKSPACE_DATA}
        itemProps={{}}
      />
    );
    await waitFor(() => expect(getByText(WORKSPACE_DATA.name)).toBeDefined());
    expect(queryByText(/Create workspace/i)).not.toBeInTheDocument();
  });

  it("proposes to create the workspace when it does not already exists", async () => {
    const { getByText } = await renderTest(
      <WorkspaceListItem
        highlight
        index={0}
        item={{
          type: "CreateWorkspaceItem",
          name: NEW_WORKSPACE_NAME,
        }}
        isCreateWorkspaceItem
        itemProps={{}}
      />
    );
    const expectedName = `"${NEW_WORKSPACE_NAME}"`;
    await waitFor(() => expect(getByText(expectedName)).toBeDefined());
    expect(getByText(/Create workspace/i)).toBeDefined();
  });
});
