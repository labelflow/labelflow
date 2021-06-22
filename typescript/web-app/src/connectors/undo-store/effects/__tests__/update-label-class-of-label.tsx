import { createUpdateLabelClassOfLabelEffect } from "../update-label-class-of-label";
import { useUndoStore } from "../..";
import { client } from "../../../apollo-client-schema";

import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("../../apollo-client-schema", () => {
  const original = jest.requireActual("../../apollo-client-schema");
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
    createUpdateLabelClassOfLabelEffect(
      {
        selectedLabelId: "my label id",
        selectedLabelClassId: "existing label class id",
      },
      { client }
    )
  );
});

it("should update the label class of a label", async () => {
  expect(client.mutate).toHaveBeenNthCalledWith(
    1,
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

it("should undo the update of the label class of a label", async () => {
  await useUndoStore.getState().undo();

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

it("should redo the update of the label class of a label", async () => {
  await useUndoStore.getState().undo();
  await useUndoStore.getState().redo();

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
