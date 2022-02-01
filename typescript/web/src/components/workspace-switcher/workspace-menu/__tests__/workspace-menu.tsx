/* eslint-disable import/order */
/* eslint-disable import/first */
import { PropsWithChildren } from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { ChakraProvider } from "@chakra-ui/react";
import { MockedProvider as ApolloProvider } from "@apollo/client/testing";

import { mockMatchMedia } from "../../../../utils/mock-window";

mockMatchMedia(jest);

import {
  ApolloMockResponses,
  getApolloMockLink,
  mockNextRouter,
  USER_WITH_WORKSPACES_DATA,
  USER_WITH_WORKSPACES_QUERY_MOCK,
  WORKSPACE_DATA,
} from "../../../../utils/tests";

mockNextRouter({ query: { workspaceSlug: WORKSPACE_DATA.slug } });

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { id: USER_WITH_WORKSPACES_DATA.id } } }),
}));

import { theme } from "../../../../theme";

import { WorkspaceMenu } from "../workspace-menu";
import { ResponsiveBreadcrumbs } from "../../../layout/top-bar/breadcrumbs";
import { UserProvider, useUser } from "../../../../hooks";

const APOLLO_MOCKS: ApolloMockResponses = [USER_WITH_WORKSPACES_QUERY_MOCK];

const WrapperBody = ({ children }: PropsWithChildren<{}>) => {
  const user = useUser();
  return (
    <>{user && <ResponsiveBreadcrumbs>{children}</ResponsiveBreadcrumbs>}</>
  );
};

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider link={getApolloMockLink(APOLLO_MOCKS)}>
    <ChakraProvider theme={theme} resetCSS>
      <UserProvider withWorkspaces>
        <WrapperBody>{children}</WrapperBody>
      </UserProvider>
    </ChakraProvider>
  </ApolloProvider>
);

const [onSelectedWorkspaceChange, createNewWorkspace] = [jest.fn(), jest.fn()];
const setIsOpen = jest.fn();

const renderClassSelectionMenu = (isOpen: boolean = false) =>
  render(
    <WorkspaceMenu
      onSelectedWorkspaceChange={onSelectedWorkspaceChange}
      createNewWorkspace={createNewWorkspace}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />,
    { wrapper }
  );
describe("WorkspaceMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders component", async () => {
    const { getByRole } = renderClassSelectionMenu();
    await waitFor(() => expect(getByRole("button")).toBeDefined());
  });

  it("opens popover when clicking on the button", async () => {
    const { getAllByLabelText } = renderClassSelectionMenu();
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
    const { getByRole } = renderClassSelectionMenu(true);
    await waitFor(() => expect(getByRole("button")).toBeDefined());
    userEvent.click(getByRole("option", { name: RegExp(WORKSPACE_DATA.name) }));
    expect(onSelectedWorkspaceChange).toHaveBeenCalledWith(WORKSPACE_DATA);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it("closes popover when creating a new workspace", async () => {
    const { getAllByPlaceholderText, getByRole } =
      renderClassSelectionMenu(true);
    await waitFor(() => expect(getByRole("button")).toBeDefined());
    const id = "813e9c45-4e59-47f6-b8c1-cd62812e2c47";
    userEvent.type(getAllByPlaceholderText(/search/i)[0], id);
    userEvent.click(getByRole("option", { name: /Create workspace/ }));
    expect(createNewWorkspace).toHaveBeenCalledWith(id);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
