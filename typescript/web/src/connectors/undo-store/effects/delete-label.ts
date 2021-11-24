import { gql, ApolloClient } from "@apollo/client";
import { omit } from "lodash/fp";

import { Label } from "@labelflow/graphql-types";
import { Effect } from "..";
import { removeLabelFromImageCache } from "./cache-updates/remove-label-from-image-cache";
import { addLabelToImageInCache } from "./cache-updates/add-label-to-image-in-cache";
import { createLabelMutation } from "./shared-queries";

const deleteLabelMutation = gql`
  mutation deleteLabel($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
      x
      y
      width
      height
      imageId
      type
      labelClass {
        id
      }
      geometry {
        type
        coordinates
      }
    }
  }
`;

export const createDeleteLabelEffect = (
  { id }: { id: string },
  {
    setSelectedLabelId,
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const { data } = await client.mutate<{
      deleteLabel: Label & { __typename: "Label" };
    }>({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["countLabelsOfDataset"],
      /* Note that there is no optimistic response here, only a cache update.
       * We could add it but it would imply to fetch a lot of data beforehand */
      update(cache, { data: updateData }) {
        if (typeof updateData?.deleteLabel?.imageId !== "string") {
          return;
        }
        removeLabelFromImageCache(cache, {
          id,
          imageId: updateData.deleteLabel.imageId,
        });
      },
    });
    setSelectedLabelId(null);
    return data?.deleteLabel;
  },
  undo: async (
    deletedLabel: Pick<
      Label,
      | "id"
      | "x"
      | "y"
      | "type"
      | "width"
      | "height"
      | "imageId"
      | "labelClass"
      | "geometry"
    >
  ) => {
    const { imageId, geometry, type } = deletedLabel;
    const labelClassId = deletedLabel?.labelClass?.id;

    const createLabelInputs = {
      id,
      imageId,
      labelClassId,
      geometry: omit(["__typename"], geometry),
      type,
    };

    /* It is important to use the same id for the re-creation when the label
     * was created in the current session to enable the undoing of the creation effect */
    await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabelsOfDataset"],
      optimisticResponse: { createLabel: { id, __typename: "Label" } },
      update(cache) {
        addLabelToImageInCache(cache, createLabelInputs);
      },
    });

    setSelectedLabelId(id);
  },
});
