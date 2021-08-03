/* eslint-disable import/first */
import { ApolloProvider, gql } from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter({
  query: { imageId: "mocked-image-id", projectId: "test project id" },
});

import { client } from "../../../../connectors/apollo-client/schema-client";
import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

import { EditLabelClassMenu } from "../edit-label-class-menu";

const testProjectId = "test project id";

setupTestsWithLocalDatabase();

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

const renderEditLabelClassMenu = () => {
  return render(<EditLabelClassMenu />, {
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
  });

  jest.clearAllMocks();
});

it("should create a class", async () => {
  renderEditLabelClassMenu();

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
  renderEditLabelClassMenu();

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
