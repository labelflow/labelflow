/* eslint-disable import/first */
import { ApolloProvider, gql } from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { mockMatchMedia } from "../../../../utils/mock-window";

mockMatchMedia(jest);

import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter({
  query: { imageId: "mocked-image-id", datasetSlug: "test-dataset" },
});

import { client } from "../../../../connectors/apollo-client/schema-client";
import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

import { EditLabelClassMenu } from "../edit-label-class-menu";

const testDatasetId = "test dataset id";

setupTestsWithLocalDatabase();

jest.mock("../../../../connectors/apollo-client/schema-client", () => {
  const original = jest.requireActual(
    "../../../../connectors/apollo-client/schema-client"
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

const createDataset = async (
  name: string,
  datasetId: string = testDatasetId
) => {
  // @ts-ignore
  return client.mutateOriginal({
    mutation: gql`
      mutation createDataset($datasetId: String, $name: String!) {
        createDataset(
          data: { id: $datasetId, name: $name, workspaceSlug: "local" }
        ) {
          id
          name
        }
      }
    `,
    variables: {
      name,
      datasetId,
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

  await createDataset("Test dataset");

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
        datasetId: testDatasetId,
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
