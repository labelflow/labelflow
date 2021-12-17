import { ApolloProvider } from "@apollo/client";
import { FORBIDDEN_WORKSPACE_SLUGS } from "@labelflow/common-resolvers";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isNil } from "lodash/fp";
import { PropsWithChildren, ReactElement, useState } from "react";
import { client } from "../../../connectors/apollo-client/schema-client";
import { CreateWorkspaceModal } from "./create-workspace-modal";

export const ApolloWrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export const renderWithApollo = (ui: ReactElement): RenderResult => {
  return render(ui, { wrapper: ApolloWrapper });
};

const INITIAL_QUERY_PARAMS = { "workspace-name": undefined };

let queryParams: Record<string, string | undefined> = INITIAL_QUERY_PARAMS;

jest.mock(
  "use-query-params",
  jest.fn(() => ({
    useQueryParam: (key: string) => {
      return useState(queryParams[key] ?? undefined);
    },
  }))
);

const initQueryParams = (
  testCaseQueryParams: Record<string, string> | undefined
) => {
  if (!isNil(testCaseQueryParams)) {
    queryParams = testCaseQueryParams;
  }
};

const restoreQueryParams = () => {
  queryParams = INITIAL_QUERY_PARAMS;
};

interface TestCase {
  workspaceName: string | undefined;
  queryParams?: Record<string, string>;
  expected: {
    createWorkspaceButton: boolean;
  };
}

const handleClose = () => {
  throw new Error("Modal was closed");
};

export const validateInput = (
  actual: string | undefined,
  expected: string | RegExp | undefined
) => {
  const input = screen.getByLabelText(
    /workspace name input/i
  ) as HTMLInputElement;
  if (!isNil(actual)) {
    userEvent.type(input, actual);
  }
  expect(input.value).toEqual(expected ?? "");
};

const validateCreateButton = async (expected: boolean) => {
  await waitFor(() => {
    const button = screen.getByLabelText(/create workspace button/i);
    const expectButton = expect(button);
    if (expected) {
      expectButton.not.toBeDisabled();
    } else {
      expectButton.toBeDisabled();
    }
  });
};

const runTest = async ({
  workspaceName,
  queryParams: testCaseQueryParams,
  expected,
}: TestCase) => {
  initQueryParams(testCaseQueryParams);
  renderWithApollo(<CreateWorkspaceModal isOpen onClose={handleClose} />);
  validateInput(
    workspaceName,
    workspaceName ?? testCaseQueryParams?.["workspace-name"]
  );
  await validateCreateButton(expected.createWorkspaceButton);
  restoreQueryParams();
};

const TEST_CASES: Record<string, TestCase> = {
  "renders a disabled button if no name is specified": {
    workspaceName: undefined,
    expected: { createWorkspaceButton: false },
  },
  "can create if the input is valid": {
    workspaceName: "My new workspace",
    expected: { createWorkspaceButton: true },
  },
  "cannot create if the input contains invalid characters": {
    workspaceName: "My new workspace!",
    expected: { createWorkspaceButton: false },
  },
  "cannot create if the input is a reserved name": {
    workspaceName: FORBIDDEN_WORKSPACE_SLUGS[0],
    expected: { createWorkspaceButton: false },
  },
  "cannot create if the name is already taken": {
    workspaceName: "test",
    expected: { createWorkspaceButton: false },
  },
};

describe("CreateWorkspaceModal", () => {
  it.each(Object.entries(TEST_CASES))("%s", async (_, testCase) => {
    await runTest(testCase);
  });
});
