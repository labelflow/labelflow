/* eslint-disable import/first */
import { ApolloProvider, gql } from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { client } from "../../../../connectors/apollo-client/schema-client";
import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

import { EditLabelClass } from "../edit-label-class";

setupTestsWithLocalDatabase();
const testProjectId = "test project id";

// FIXME: mockNextRouter wasn't working here so we had to re-implement the mock
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    query: { projectId: testProjectId },
  })),
}));

jest.mock("../../../../connectors/apollo-client-schema", () => {
  const original = jest.requireActual(
    "../../../../connectors/apollo-client-schema"
  );
  return {
    client: {
      ...original.client,
      mutate: jest.fn(() => {
        return { data: { createLabelClass: { id: "label class id" } } };
      }),
      mutateOriginal: original.client.mutate,
      query: jest.fn(() => {
        return {
          data: {
            labelClasses: [
              {
                id: "existing label class id",
                name: "existing label class",
                color: "0xaa45f7",
              },
            ],
            label: {
              id: "my label id",
              labelClass: {
                id: "previous label class id",
              },
            },
          },
        };
      }),
    },
  };
});

const createProject = async (
  name: string,
  projectId: string = testProjectId
) => {
  // @ts-ignore
  return client.mutateOriginal({
    mutation: gql`
      mutation createProject($projectId: String, $name: String!) {
        createProject(data: { id: $projectId, name: $name }) {
          id
          name
        }
      }
    `,
    variables: {
      name,
      projectId,
    },
    fetchPolicy: "no-cache",
  });
};

const onClose = jest.fn();

const renderEditLabelClass = () => {
  return render(<EditLabelClass isOpen onClose={onClose} />, {
    wrapper: ({ children }) => (
      <ApolloProvider client={client}>{children}</ApolloProvider>
    ),
  });
};

beforeEach(async () => {
  useLabellingStore.setState({
    selectedLabelId: "my label id",
    selectedTool: Tools.SELECTION,
  });

  await createProject("Test project");

  // @ts-ignore
  await client.mutateOriginal({
    mutation: gql`
      mutation createLabelClass($data: LabelClassCreateInput!) {
        createLabelClass(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        id: "existing label class id",
        name: "existing label class",
        color: "0xaa45f7",
        projectId: testProjectId,
      },
    },
    fetchPolicy: "no-cache",
  });
});

it("should create a class", async () => {
  renderEditLabelClass();

  userEvent.type(screen.getByPlaceholderText(/Search/), "newClass{enter}");

  await waitFor(() => {
    expect(client.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          data: expect.objectContaining({
            name: "newClass",
          }),
        },
      })
    );
  });

  await waitFor(() => {
    expect(client.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          data: {
            labelClassId: "label class id",
          },
          where: { id: "my label id" },
        },
      })
    );
  });
});

it("should change a class", async () => {
  renderEditLabelClass();

  await waitFor(() =>
    expect(screen.getByText(/existing label class/)).toBeDefined()
  );

  userEvent.click(screen.getByText(/existing label class/));

  await waitFor(() => {
    expect(client.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          data: {
            labelClassId: "existing label class id",
          },
          where: { id: "my label id" },
        },
      })
    );
  });
});
