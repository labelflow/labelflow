/* eslint-disable import/order */
/* eslint-disable import/first */
import React, { PropsWithChildren } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";

import { mockMatchMedia } from "../../../../utils/mock-window";

mockMatchMedia(jest);

import { client } from "../../../../connectors/apollo-client/schema-client";
import { theme } from "../../../../theme";

import { WorkspaceMenu } from "../workspace-menu";
import { WorkspaceItem } from "../workspace-selection-popover";
import { ResponsiveBreadcrumbs } from "../../../layout/top-bar/breadcrumbs";

// // Mock apollo client to be able to test if the mutate function is called during the tests
// jest.mock("../../../connectors/apollo-client/schema-client", () => {
//   const original = jest.requireActual(
//     "../../../connectors/apollo-client/schema-client"
//   );

//   return {
//     client: { ...original.client, mutate: jest.fn(original.client.mutate) },
//   };
// });
const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme} resetCSS>
      <ResponsiveBreadcrumbs>{children}</ResponsiveBreadcrumbs>
    </ChakraProvider>
  </ApolloProvider>
);

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

const [onSelectedWorkspaceChange, createNewWorkspace] = [jest.fn(), jest.fn()];
const setIsOpen = jest.fn();

const renderClassSelectionMenu = (
  workspacesInput: WorkspaceItem[],
  selectedWorkspace: WorkspaceItem,
  isOpen: boolean = false
): void => {
  render(
    <WorkspaceMenu
      workspaces={workspacesInput}
      onSelectedWorkspaceChange={onSelectedWorkspaceChange}
      createNewWorkspace={createNewWorkspace}
      selectedWorkspace={selectedWorkspace}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />,
    { wrapper }
  );
};

describe("Workspace menu tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Should render component", () => {
    renderClassSelectionMenu(workspaces, workspaces[0]);

    expect(screen.getByRole("button")).toBeDefined();
  });

  test("Should render with a selected label class", () => {
    renderClassSelectionMenu(workspaces, workspaces[0]);

    expect(screen.getByRole("button")).toBeDefined();
  });

  test("Should open popover when clicking on the button", () => {
    renderClassSelectionMenu(workspaces, workspaces[0]);

    expect(
      screen.getAllByLabelText("Workspace selection menu popover")
    ).toBeDefined();

    expect(setIsOpen).not.toHaveBeenCalled();

    userEvent.click(
      screen.getAllByLabelText("Open workspace selection popover")[0]
    );

    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  test("Should close popover when clicking on a class", () => {
    renderClassSelectionMenu(workspaces, workspaces[0], true);
    userEvent.click(
      screen.getByRole("option", { name: RegExp(workspaces[0].name) })
    );

    expect(onSelectedWorkspaceChange).toHaveBeenCalledWith(workspaces[0]);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("Should close popover when creating a new class", () => {
    renderClassSelectionMenu(workspaces, workspaces[0], true);
    userEvent.type(screen.getAllByPlaceholderText(/search/i)[0], "Perso");
    userEvent.click(screen.getByRole("option", { name: /Create workspace/ }));

    expect(createNewWorkspace).toHaveBeenCalledWith("Perso");
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
