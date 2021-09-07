import { createCreateLabelClassEffect } from "../create-label-class";
import { useUndoStore } from "../..";
import { useLabellingStore } from "../../../labeling-state";
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
  await perform(
    createCreateLabelClassEffect(
      {
        name: "new label class",
        color: "0xaa45f8",
        datasetId: "a dataset id",
        datasetSlug: "a-dataset-slug",
        selectedLabelClassIdPrevious: "previous label class id",
      },
      { client }
    )
  );
});

it("should create the label class and update the labeling store", async () => {
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
  expect(useLabellingStore.getState()).toMatchObject({
    selectedLabelClassId: "label class id",
  });
});

it("should undo the label class creation the update of the labeling store", async () => {
  await useUndoStore.getState().undo();

  expect(client.mutate).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      variables: {
        where: { id: "label class id" },
      },
    })
  );
  expect(useLabellingStore.getState()).toMatchObject({
    selectedLabelClassId: "previous label class id",
  });
});

it("should redo the update of the label class of a label and the update of the labeling store", async () => {
  await useUndoStore.getState().undo();
  await useUndoStore.getState().redo();

  expect(client.mutate).toHaveBeenNthCalledWith(
    3,
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
  expect(useLabellingStore.getState()).toMatchObject({
    selectedLabelClassId: "label class id",
  });
});
