/* eslint-disable import/first */
import { ApolloProvider } from "@apollo/client";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import gql from "graphql-tag";

import { mockNextRouter } from "../../../../utils/router-mocks";

import { client } from "../../../../connectors/apollo-client-schema";
import { useUndoStore } from "../../../../connectors/undo-store";
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

it("should undo a class creation", async () => {
  renderEditLabelClass();

  userEvent.type(screen.getByPlaceholderText(/Search/), "newClass{enter}");

  await act(async () => {
    await useUndoStore.getState().undo();
  });

  await waitFor(() => {
    expect(client.mutate).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        variables: {
          data: {
            labelClassId: "previous label class id",
          },
          where: { id: "my label id" },
        },
      })
    );
  });

  await waitFor(() => {
    expect(client.mutate).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        variables: {
          where: {
            id: "label class id",
          },
        },
      })
    );
  });
});

it("should redo a class creation", async () => {
  renderEditLabelClass();

  await userEvent.type(
    screen.getByPlaceholderText(/Search/),
    "newClass{enter}"
  );

  await act(async () => {
    await useUndoStore.getState().undo();
    await useUndoStore.getState().redo();
  });

  await waitFor(() => {
    expect(client.mutate).toHaveBeenNthCalledWith(
      5,
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
    expect(client.mutate).toHaveBeenNthCalledWith(
      6,
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

it("should undo a class change", async () => {
  renderEditLabelClass();

  await waitFor(() =>
    expect(screen.getByText(/existing label class/)).toBeDefined()
  );

  await userEvent.click(screen.getByText(/existing label class/));

  await act(async () => {
    await useUndoStore.getState().undo();
  });

  await waitFor(() => {
    expect(client.mutate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        variables: {
          data: {
            labelClassId: "previous label class id",
          },
          where: { id: "my label id" },
        },
      })
    );
  });
});

it("should redo a class change", async () => {
  renderEditLabelClass();

  await waitFor(() =>
    expect(screen.getByText(/existing label class/)).toBeDefined()
  );

  await userEvent.click(screen.getByText(/existing label class/));

  await act(async () => {
    await useUndoStore.getState().undo();
    await useUndoStore.getState().redo();
  });

  await waitFor(() => {
    expect(client.mutate).toHaveBeenNthCalledWith(
      3,
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
