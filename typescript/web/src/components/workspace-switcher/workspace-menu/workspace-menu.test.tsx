/* eslint-disable import/order */
import { PropsWithChildren } from "react";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { mockMatchMedia } from "../../../utils/mock-window";

mockMatchMedia(jest);

import { mockWorkspace } from "../../../utils/tests/mock-workspace";

mockWorkspace();

import { useUser } from "../../../hooks";
import { ResponsiveBreadcrumbs } from "../../layout/top-bar/breadcrumbs";
import {
  USER_WITH_WORKSPACES_QUERY_MOCK,
  WORKSPACE_DATA,
} from "../../../utils/fixtures";
import {
  ApolloMockResponses,
  renderWithTestWrapper,
} from "../../../utils/tests";
import { WorkspaceMenu } from "./workspace-menu";

const APOLLO_MOCKS: ApolloMockResponses = [USER_WITH_WORKSPACES_QUERY_MOCK];

const WrapperBody = ({ children }: PropsWithChildren<{}>) => {
  const user = useUser();
  return (
    <>{user && <ResponsiveBreadcrumbs>{children}</ResponsiveBreadcrumbs>}</>
  );
};

const [onSelectedWorkspaceChange, createNewWorkspace] = [jest.fn(), jest.fn()];
const setIsOpen = jest.fn();

const renderTest = (isOpen: boolean = false) =>
  renderWithTestWrapper(
    <WorkspaceMenu
      onSelectedWorkspaceChange={onSelectedWorkspaceChange}
      createNewWorkspace={createNewWorkspace}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />,
    {
      auth: { withWorkspaces: true },
      apollo: { extraMocks: APOLLO_MOCKS },
      renderOptions: { wrapper: WrapperBody },
    }
  );

describe(WorkspaceMenu, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders component", async () => {
    const { getByRole } = await renderTest();
    await waitFor(() => expect(getByRole("button")).toBeDefined());
  });

  it("opens popover when clicking on the button", async () => {
    const { getAllByLabelText } = await renderTest();
    await waitFor(() =>
      expect(
        getAllByLabelText("Workspace selection menu popover")
      ).toBeDefined()
    );
    expect(setIsOpen).not.toHaveBeenCalled();
    userEvent.click(getAllByLabelText("Open workspace selection popover")[0]);
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  it("closes popover when clicking on a workspace", async () => {
    const { getByRole } = await renderTest(true);
    await waitFor(() => expect(getByRole("button")).toBeDefined());
    userEvent.click(getByRole("option", { name: RegExp(WORKSPACE_DATA.name) }));
    expect(onSelectedWorkspaceChange).toHaveBeenCalledWith(WORKSPACE_DATA);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it("closes popover when creating a new workspace", async () => {
    const { getAllByPlaceholderText, getByRole } = await renderTest(true);
    await waitFor(() => expect(getByRole("button")).toBeDefined());
    const id = "813e9c45-4e59-47f6-b8c1-cd62812e2c47";
    userEvent.type(getAllByPlaceholderText(/search/i)[0], id);
    userEvent.click(getByRole("option", { name: /Create workspace/ }));
    expect(createNewWorkspace).toHaveBeenCalledWith(id);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
