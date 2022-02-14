import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import { mockWorkspace } from "../../../../utils/tests/mock-workspace";

mockWorkspace();

import { UserWithWorkspacesQuery_user_memberships_workspace } from "../../../../graphql-types/UserWithWorkspacesQuery";
import { USER_WITH_WORKSPACES_QUERY } from "../../../../shared-queries/user.query";
import { WithWorkspacesUserTuple } from "../../../../hooks";
import {
  USER_WITH_WORKSPACES_DATA,
  WORKSPACE_DATA,
  mockUserQuery,
} from "../../../../utils/fixtures";

import { renderWithTestWrapper } from "../../../../utils/tests";
import { WorkspaceSelectionPopover } from "./workspace-selection-popover";

const [onClose, onSelectedWorkspaceChange, createNewWorkspace] = [
  jest.fn(),
  jest.fn(),
  jest.fn(),
];

const WORKSPACE_1_DATA: UserWithWorkspacesQuery_user_memberships_workspace = {
  ...WORKSPACE_DATA,
  id: "c6eafa43-f7ff-480d-89c1-10533100da97",
  name: "FirstWorkspace",
  slug: "firstworkspace",
};

const WORKSPACE_2_DATA: UserWithWorkspacesQuery_user_memberships_workspace = {
  ...WORKSPACE_DATA,
  id: "49b72357-abaa-442c-9235-bcec376b4ee2",
  name: "SecondWorkspace",
  slug: "secondworkspace",
};

const getUserWorkspaces = (noWorkspaces: boolean | undefined) =>
  noWorkspaces ? [] : [WORKSPACE_1_DATA, WORKSPACE_2_DATA];

const getUserData = (noWorkspaces: boolean | undefined) => {
  const workspaces = getUserWorkspaces(noWorkspaces);
  const memberships = workspaces.map((workspace) => ({ workspace }));
  return { ...USER_WITH_WORKSPACES_DATA, memberships };
};

const getApolloMocks = (noWorkspaces: boolean | undefined) => [
  mockUserQuery<WithWorkspacesUserTuple>(
    USER_WITH_WORKSPACES_QUERY,
    getUserData(noWorkspaces)
  ),
];

const renderTest = async (noWorkspaces?: boolean) => {
  const result = await renderWithTestWrapper(
    <WorkspaceSelectionPopover
      trigger={<div>Ok</div>}
      isOpen
      onClose={onClose}
      onSelectedWorkspaceChange={onSelectedWorkspaceChange}
      createNewWorkspace={createNewWorkspace}
    />,
    {
      auth: { withWorkspaces: true },
      apollo: { mocks: getApolloMocks(noWorkspaces) },
    }
  );
  const { getByTestId } = result;
  expect(getByTestId("workspace-selection-popover-body")).toBeDefined();
  return result;
};

describe(WorkspaceSelectionPopover, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders component", async () => {
    const { getByPlaceholderText } = await renderTest();
    expect(getByPlaceholderText(/search/i)).toBeDefined();
  });

  it("renders no workspaces if none were given", async () => {
    const { queryByText } = await renderTest(true);
    expect(queryByText(WORKSPACE_1_DATA.name)).not.toBeInTheDocument();
    expect(queryByText(WORKSPACE_2_DATA.name)).not.toBeInTheDocument();
  });

  it("renders all workspaces in the list", async () => {
    const { getByText } = await renderTest();
    expect(getByText(WORKSPACE_1_DATA.name)).toBeDefined();
    expect(getByText(WORKSPACE_2_DATA.name)).toBeDefined();
  });

  it("renders matching workspaces with user search", async () => {
    const { getByPlaceholderText, getByText, queryByText } = await renderTest();
    const searchTerm = WORKSPACE_1_DATA.name.substring(0, 3);
    userEvent.type(getByPlaceholderText(/search/i), searchTerm);
    expect(getByText(WORKSPACE_1_DATA.name)).toBeDefined();
    expect(queryByText(WORKSPACE_2_DATA.name)).not.toBeInTheDocument();
    expect(getByText(/Create workspace/)).toBeDefined();
    expect(getByText(`"${searchTerm}"`)).toBeDefined();
  });

  it("calls onSelectedWorkspaceChange when clicking on existing workspace", async () => {
    const { getByRole } = await renderTest();
    userEvent.click(
      getByRole("option", {
        name: `${WORKSPACE_2_DATA.name} ${WORKSPACE_2_DATA.name}`,
      })
    );
    expect(onSelectedWorkspaceChange).toHaveBeenCalledWith(
      expect.objectContaining(WORKSPACE_2_DATA)
    );
  });

  it("calls onSelectedWorkspaceChange when clicking on create new workspace", async () => {
    const { getByPlaceholderText, getByRole } = await renderTest();
    const searchTerm = WORKSPACE_1_DATA.name.substring(0, 3);
    userEvent.type(getByPlaceholderText(/search/i), searchTerm);
    userEvent.click(getByRole("option", { name: /Create workspace/ }));
    expect(createNewWorkspace).toHaveBeenCalledWith(searchTerm);
  });
});
