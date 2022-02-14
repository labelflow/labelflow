import { MockedProvider as ApolloProvider } from "@apollo/client/testing";
import {
  FORBIDDEN_WORKSPACE_SLUGS,
  INVALID_WORKSPACE_NAME_MESSAGES,
} from "@labelflow/common-resolvers";
import { isEmpty, isNil } from "lodash/fp";
import { PropsWithChildren, useEffect } from "react";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import {
  useWorkspaceNameInput,
  WorkspaceNameInput,
  WorkspaceNameInputProvider,
  WorkspaceNameMessage,
} from ".";
import {
  WorkspaceExistsQuery,
  WorkspaceExistsQueryVariables,
} from "../../graphql-types/WorkspaceExistsQuery";
import { MockableLocationProvider } from "../../utils/mockable-location";
import {
  ApolloMockResponse,
  ApolloMockResponses,
  getApolloMockLink,
} from "../../utils/tests";
import { WORKSPACE_EXISTS_QUERY } from "./workspace-exists.query";
import { WorkspaceNameMessageProps } from "./workspace-name-message";

export const WORKSPACE_EXISTS_MOCK: ApolloMockResponse<
  WorkspaceExistsQuery,
  WorkspaceExistsQueryVariables
> = {
  request: {
    query: WORKSPACE_EXISTS_QUERY,
    variables: MATCH_ANY_PARAMETERS,
  },
  nMatches: Number.POSITIVE_INFINITY,
  result: ({ slug }) => ({
    data: { workspaceExists: slug === "already-taken-name" },
  }),
};

export const GRAPHQL_MOCKS: ApolloMockResponses = [WORKSPACE_EXISTS_MOCK];

export type TestComponentProps = Partial<WorkspaceNameMessageProps> & {
  name?: string;
  defaultName?: string;
  graphqlMocks?: ApolloMockResponses;
  storybook?: boolean;
  origin?: string;
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

const Wrapper = ({
  name,
  storybook = false,
  defaultName,
  children,
}: PropsWithChildren<TestComponentProps>) => (
  <MockableLocationProvider
    location={storybook ? "http://localhost" : undefined}
  >
    <ApolloProvider link={getApolloMockLink(GRAPHQL_MOCKS)}>
      <WorkspaceNameInputProvider defaultName={defaultName}>
        <NameObserver name={name} storybook={storybook} />
        {children}
      </WorkspaceNameInputProvider>
    </ApolloProvider>
  </MockableLocationProvider>
);

export const TestComponent = ({
  name,
  storybook,
  defaultName,
  hideError = false,
  ...messageProps
}: TestComponentProps) => (
  <Wrapper name={name} storybook={storybook} defaultName={defaultName}>
    <WorkspaceNameInput />
    <WorkspaceNameMessage hideError={hideError} {...messageProps} />
  </Wrapper>
);

export type TestCase = [TestComponentProps, string];

export const TEST_CASES: Record<string, TestCase> = {
  "renders the future url if it is possible": [
    { name: "test" },
    "URL will be: http://localhost/test",
  ],
  "uses present tense when isEditing is true": [
    { name: "test", isEditing: true },
    "Workspace URL: http://localhost/test",
  ],
  "warns if the name is a reserved name": [
    { name: FORBIDDEN_WORKSPACE_SLUGS[0] },
    INVALID_WORKSPACE_NAME_MESSAGES.forbiddenSlug,
  ],
  "warns if the name contains invalid characters": [
    { name: "hello!" },
    INVALID_WORKSPACE_NAME_MESSAGES.invalidNameCharacters,
  ],
  "warns if the name is already taken": [
    { name: "Already taken name" },
    INVALID_WORKSPACE_NAME_MESSAGES.workspaceExists,
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
