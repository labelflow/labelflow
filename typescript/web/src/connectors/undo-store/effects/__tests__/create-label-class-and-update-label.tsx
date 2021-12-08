import { createCreateLabelClassAndUpdateLabelEffect } from "../create-label-class-and-update-label";
import { useUndoStore } from "../..";
import { useLabelingStore } from "../../../labeling-state";
import { client } from "../../../apollo-client/schema-client";

import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("../../../apollo-client/schema-client", () => {
  const original = jest.requireActual("../../../apollo-client/schema-client");
  return {
    client: {
      ...original.client,
      mutate: jest.fn(() => {
        return { data: { createLabelClass: { id: "label class id" } } };
      }),
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

const { perform } = useUndoStore.getState();

beforeEach(async () => {
  jest.clearAllMocks();
  useLabelingStore.setState({
    selectedLabelClassId: "previous label class id",
  });
  await perform(
    createCreateLabelClassAndUpdateLabelEffect(
      {
        name: "new label class",
        color: "0xaa45f8",
        datasetId: "a dataset id",
        selectedLabelId: "my label id",
      },
      { client }
    )
  );
});

it("should create the label class and update the label and the labeling store", async () => {
  expect(client.mutate).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      variables: {
        data: {
          name: "new label class",
          color: "0xaa45f8",
          datasetId: "a dataset id",
        },
      },
    })
  );
  expect(client.mutate).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      variables: {
        where: { id: "my label id" },
        data: { labelClassId: "label class id" },
      },
    })
  );
  expect(useLabelingStore.getState()).toMatchObject({
    selectedLabelClassId: "label class id",
  });
});

it("should undo the label class creation and update the label and the labeling store", async () => {
  await useUndoStore.getState().undo();

  expect(client.mutate).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      variables: {
        where: { id: "my label id" },
        data: { labelClassId: "previous label class id" },
      },
    })
  );
  expect(client.mutate).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({
      variables: {
        where: { id: "label class id" },
      },
    })
  );
  expect(useLabelingStore.getState()).toMatchObject({
    selectedLabelClassId: "previous label class id",
  });
});

it("should redo the label class creation and the update of the label class of a label and the labeling store", async () => {
  await useUndoStore.getState().undo();
  await useUndoStore.getState().redo();

  expect(client.mutate).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({
      variables: {
        data: {
          name: "new label class",
          color: "0xaa45f8",
          datasetId: "a dataset id",
          id: "label class id",
        },
      },
    })
  );
  expect(client.mutate).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({
      variables: {
        where: { id: "my label id" },
        data: { labelClassId: "label class id" },
      },
    })
  );
  expect(useLabelingStore.getState()).toMatchObject({
    selectedLabelClassId: "label class id",
  });
});
