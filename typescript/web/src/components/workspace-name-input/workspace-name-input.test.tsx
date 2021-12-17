import { MockedProvider as ApolloProvider } from "@apollo/client/testing";
import { FORBIDDEN_WORKSPACE_SLUGS } from "@labelflow/common-resolvers";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isEmpty, isNil } from "lodash/fp";
import { PropsWithChildren } from "react";
import {
  WorkspaceNameInput,
  WorkspaceNameMessage,
  WorkspaceNameMessageProps,
} from ".";
import { WorkspaceNameInputProvider } from "./workspace-name-input.context";
import { GRAPHQL_MOCKS } from "./workspace-name-input.fixtures";

jest.mock(
  "use-debounce",
  jest.fn(() => ({ useDebounce: (value: unknown) => [value] }))
);

export const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider mocks={GRAPHQL_MOCKS}>{children}</ApolloProvider>
);

interface Input extends Partial<WorkspaceNameMessageProps> {
  name?: string;
  defaultName?: string;
}

type TestCase = [Input, string];

const runTest = async ([props, expected]: TestCase): Promise<void> => {
  const { name, defaultName, hideError, ...messageProps } = props;
  render(
    <WorkspaceNameInputProvider defaultName={defaultName}>
      <WorkspaceNameInput />
      <WorkspaceNameMessage hideError={hideError ?? false} {...messageProps} />
    </WorkspaceNameInputProvider>,
    { wrapper: Wrapper }
  );
  if (!isNil(name) && !isEmpty(name)) {
    const inputElement = screen.getByLabelText("workspace name input");
    userEvent.type(inputElement, name);
  }
  const messageElement = screen.getByLabelText("workspace name message");
  await waitFor(() => {
    expect(messageElement.innerHTML).toBe(expected);
  });
};

const TEST_CASES: Record<string, TestCase> = {
  "renders the future url if it is possible": [
    { name: "test" },
    "URL will be http://localhost/test",
  ],
  "uses present tense when isEditing is true": [
    { name: "test", isEditing: true },
    "Workspace URL: http://localhost/test",
  ],
  "warns if the name is a reserved name": [
    { name: FORBIDDEN_WORKSPACE_SLUGS[0] },
    `This name is reserved`,
  ],
  "warns if the name contains invalid characters": [
    { name: "hello!" },
    "Name contains invalid characters",
  ],
  "warns if the name is already taken": [
    { name: "Already taken name" },
    "A workspace with the slug already-taken-name already exists",
  ],
  "displays the error if given one": [
    { customError: "this is an error" },
    "this is an error",
  ],
  "warns if no workspace name is provided": [{}, "Name is empty"],
  "has an empty text when error is hidden": [{ name: "", hideError: true }, ""],
};

describe("WorkspaceNameInput", () => {
  it.each(Object.entries(TEST_CASES))("%s", async (_, testCase) => {
    await runTest(testCase);
  });
});
