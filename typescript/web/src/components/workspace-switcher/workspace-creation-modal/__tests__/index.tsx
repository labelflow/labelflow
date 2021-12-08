import React, { useState } from "react";
import { ApolloProvider, ApolloError } from "@apollo/client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { forbiddenWorkspaceSlugs } from "@labelflow/common-resolvers";
import { WorkspaceCreationModal, WorkspaceNameMessage } from "..";
import { client } from "../../../../connectors/apollo-client/schema-client";

const initialState: Record<string, any> = { "workspace-name": undefined };

jest.mock(
  "use-query-params",
  jest.fn(() => ({
    useQueryParam: (key: keyof typeof initialState) =>
      useState(initialState[key] ?? undefined),
  }))
);

describe("WorkspaceNameMessage", () => {
  it("renders the future url if it is possible", () => {
    const { getByText } = render(
      <WorkspaceNameMessage
        error={undefined}
        workspaceName="test"
        workspaceSlug="test"
        workspaceExists={false}
        isInvalid={false}
      />
    );
    expect(
      getByText(/Your URL will be: http:\/\/localhost\/test/)
    ).toBeDefined();
  });

  it("warns if the name is already taken", () => {
    const { getByText } = render(
      <WorkspaceNameMessage
        error={undefined}
        workspaceName="test"
        workspaceSlug="test"
        workspaceExists
        isInvalid
      />
    );
    expect(getByText(/The name "test" is already taken/)).toBeDefined();
  });

  it("warns if the name is a reserved name", () => {
    const { getByText } = render(
      <WorkspaceNameMessage
        error={undefined}
        workspaceName={forbiddenWorkspaceSlugs[0]}
        workspaceSlug={forbiddenWorkspaceSlugs[0]}
        workspaceExists={false}
        isInvalid
      />
    );
    expect(getByText(/The name ".*?" is already taken/)).toBeDefined();
  });

  it("warns if the name contains invalid characters", () => {
    const { getByText } = render(
      <WorkspaceNameMessage
        error={undefined}
        workspaceName="hello!"
        workspaceSlug="hello"
        workspaceExists={false}
        isInvalid
      />
    );
    expect(
      getByText('The name "hello!" contains invalid characters.')
    ).toBeDefined();
  });

  it("displays the error if given one", () => {
    const { getByText } = render(
      <WorkspaceNameMessage
        error={new ApolloError({ errorMessage: "this is an error" })}
        workspaceName="test"
        workspaceSlug="test"
        workspaceExists={false}
        isInvalid
      />
    );
    expect(getByText(/this is an error/)).toBeDefined();
  });

  it("displays an empty line if no workspace name is provided", () => {
    const { container } = render(
      <WorkspaceNameMessage
        error={undefined}
        workspaceName=""
        workspaceSlug=""
        workspaceExists={false}
        isInvalid
      />
    );

    expect(container.getElementsByTagName("br").length).toEqual(1);
  });
});

describe("WorkspaceCreationModal", () => {
  const Wrapper = ({ children }: React.PropsWithChildren<{}>) => (
    // <QueryParamProvider>
    <ApolloProvider client={client}>{children}</ApolloProvider>
    // </QueryParamProvider>
  );
  it("renders a disabled button if no name is specified", () => {
    const { getByRole } = render(
      <WorkspaceCreationModal isOpen onClose={console.log} />,
      { wrapper: Wrapper }
    );
    expect(getByRole("button", { name: "Create workspace" })).toBeDisabled();
  });

  it("can create if the input is valid", () => {
    const { getByRole } = render(
      <WorkspaceCreationModal isOpen onClose={console.log} />,
      { wrapper: Wrapper }
    );

    const input = screen.getByLabelText(
      /workspace name input/i
    ) as HTMLInputElement;

    userEvent.type(input, "My new workspace");

    expect(
      getByRole("button", { name: "Create workspace" })
    ).not.toBeDisabled();
  });

  it("cannot create if the input contains invalid characters", () => {
    const { getByRole } = render(
      <WorkspaceCreationModal isOpen onClose={console.log} />,
      { wrapper: Wrapper }
    );

    const input = screen.getByLabelText(
      /workspace name input/i
    ) as HTMLInputElement;

    userEvent.type(input, "My new workspace!");

    expect(getByRole("button", { name: "Create workspace" })).toBeDisabled();
  });

  it("cannot create if the input is a reserved name", () => {
    const { getByRole } = render(
      <WorkspaceCreationModal isOpen onClose={console.log} />,
      { wrapper: Wrapper }
    );

    const input = screen.getByLabelText(
      /workspace name input/i
    ) as HTMLInputElement;

    userEvent.type(input, "settings");

    expect(getByRole("button", { name: "Create workspace" })).toBeDisabled();
  });

  it("cannot create if the name is already taken", () => {
    const { getByRole } = render(
      <WorkspaceCreationModal isOpen onClose={console.log} />,
      { wrapper: Wrapper }
    );

    const input = screen.getByLabelText(
      /workspace name input/i
    ) as HTMLInputElement;

    userEvent.type(input, "local");

    expect(getByRole("button", { name: "Create workspace" })).toBeDisabled();
  });

  it("pre-fills the workspace name", () => {
    initialState["workspace-name"] = "Pre-filled workspace name";
    render(<WorkspaceCreationModal isOpen onClose={console.log} />, {
      wrapper: Wrapper,
    });

    const input = screen.getByLabelText(
      /workspace name input/i
    ) as HTMLInputElement;

    expect(input.value).toEqual("Pre-filled workspace name");
  });
});
