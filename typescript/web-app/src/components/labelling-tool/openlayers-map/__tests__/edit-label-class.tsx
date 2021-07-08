/* eslint-disable import/first */
import { ApolloProvider } from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import gql from "graphql-tag";

import { mockNextRouter } from "../../../../utils/router-mocks";

import { client } from "../../../../connectors/apollo-client-schema";
import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

import { EditLabelClass } from "../edit-label-class";

mockNextRouter({ query: { id: "mocked-image-id" } });

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
  await waitFor(() => {
    // @ts-ignore
    client.mutateOriginal({
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
        },
      },
    });
  });
  jest.clearAllMocks();
});

it("should create a class", async () => {
  renderEditLabelClass();

  await userEvent.type(
    screen.getByPlaceholderText(/Search/),
    "newClass{enter}"
  );

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

  await userEvent.click(screen.getByText(/existing label class/));

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
