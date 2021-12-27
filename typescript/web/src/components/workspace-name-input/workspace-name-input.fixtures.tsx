import {
  MockedProvider as ApolloProvider,
  MockedResponse as ApolloResponse,
} from "@apollo/client/testing";
import { FORBIDDEN_WORKSPACE_SLUGS } from "@labelflow/common-resolvers";
import { Mutation, Query } from "@labelflow/graphql-types";
import { isEmpty, isNil } from "lodash/fp";
import { useEffect } from "react";
import {
  useWorkspaceNameInput,
  WorkspaceNameInput,
  WorkspaceNameInputProvider,
  WorkspaceNameMessage,
} from ".";
import { WORKSPACE_EXISTS_QUERY } from "./workspace-exists.query";
import { WorkspaceNameMessageProps } from "./workspace-name-message";

export type ApolloMock = ApolloResponse<Partial<Query | Mutation>>;

export const WORKSPACE_EXISTS_MOCK_ALREADY_TAKEN_NAME: ApolloMock = {
  request: {
    query: WORKSPACE_EXISTS_QUERY,
    variables: { slug: "already-taken-name" },
  },
  result: { data: { workspaceExists: true } },
};

export const WORKSPACE_EXISTS_MOCK_TEST: ApolloMock = {
  request: {
    query: WORKSPACE_EXISTS_QUERY,
    variables: { slug: "test" },
  },
  result: { data: { workspaceExists: false } },
};

export type TestComponentProps = Partial<WorkspaceNameMessageProps> & {
  name?: string;
  defaultName?: string;
  graphqlMocks?: ApolloResponse<Partial<Query | Mutation>>[];
  storybook?: boolean;
};

const NameObserver = ({
  name,
  storybook,
}: Pick<TestComponentProps, "name" | "storybook">) => {
  const { setName } = useWorkspaceNameInput();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (storybook && !isNil(name) && !isEmpty(name)) {
      setName(name);
    }
  }, [storybook, name, setName]);
  return null;
};

export const TestComponent = ({
  name,
  storybook,
  defaultName,
  hideError = false,
  graphqlMocks = [WORKSPACE_EXISTS_MOCK_TEST],
  ...messageProps
}: TestComponentProps) => (
  <ApolloProvider mocks={graphqlMocks}>
    <WorkspaceNameInputProvider defaultName={defaultName}>
      <NameObserver name={name} storybook={storybook} />
      <WorkspaceNameInput />
      <WorkspaceNameMessage hideError={hideError} {...messageProps} />
    </WorkspaceNameInputProvider>
  </ApolloProvider>
);

export type TestCase = [TestComponentProps, string];

export const TEST_CASES: Record<string, TestCase> = {
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
    {
      name: "Already taken name",
      graphqlMocks: [WORKSPACE_EXISTS_MOCK_ALREADY_TAKEN_NAME],
    },
    "A workspace with the slug already-taken-name already exists",
  ],
  "displays the error if given one": [
    { customError: "this is an error" },
    "this is an error",
  ],
  "warns if no workspace name is provided": [{}, "Name is empty"],
  "has an empty text when error is hidden": [
    { name: "", hideError: true },
    "<br>",
  ],
};
