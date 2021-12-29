import React, { useState } from "react";
import { ApolloProvider, ApolloError } from "@apollo/client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { forbiddenWorkspaceSlugs } from "@labelflow/common-resolvers";
import { WorkspaceCreationModal, Message } from "..";
import { client } from "../../../../connectors/apollo-client/schema-client";

const initialState: Record<string, any> = { "workspace-name": undefined };

jest.mock(
  "use-query-params",
  jest.fn(() => ({
    useQueryParam: (key: keyof typeof initialState) =>
      useState(initialState[key] ?? undefined),
  }))
);

describe("Message", () => {
  it("renders the future url if it is possible", () => {
    const { getByText } = render(
      <Message
        error={undefined}
        workspaceName="test"
        isWorkspaceSlugAlreadyTaken={false}
      />
    );
    expect(
      getByText(/Your URL will be: http:\/\/localhost\/test/)
    ).toBeDefined();
  });

  it("warns if the name is already taken", () => {
    const { getByText } = render(
      <Message
        error={undefined}
        workspaceName="test"
        isWorkspaceSlugAlreadyTaken
      />
    );
    expect(getByText(/The name "test" is already taken/)).toBeDefined();
  });

  it("warns if the name is a reserved name", () => {
    const { getByText } = render(
      <Message
        error={undefined}
        workspaceName={forbiddenWorkspaceSlugs[0]}
        isWorkspaceSlugAlreadyTaken={false}
      />
    );
    expect(getByText(/The name ".*?" is already taken/)).toBeDefined();
  });

  it("warns if the name contains invalid characters", () => {
    const { getByText } = render(
      <Message
        error={undefined}
        workspaceName="hello!"
        isWorkspaceSlugAlreadyTaken={false}
      />
    );
    expect(
      getByText('The name "hello!" contains invalid characters.')
    ).toBeDefined();
  });

  it("displays the error if given one", () => {
    const { getByText } = render(
      <Message
        error={new ApolloError({ errorMessage: "this is an error" })}
        workspaceName="test"
        isWorkspaceSlugAlreadyTaken={false}
      />
    );
    expect(getByText(/this is an error/)).toBeDefined();
  });

  it("displays an empty line if no workspace name is provided", () => {
    const { container } = render(
      <Message
        error={undefined}
        workspaceName={undefined}
        isWorkspaceSlugAlreadyTaken={false}
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
