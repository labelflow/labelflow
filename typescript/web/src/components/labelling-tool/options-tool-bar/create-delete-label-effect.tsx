import { gql, ApolloClient } from "@apollo/client";
import { omit } from "lodash/fp";

import { Label } from "@labelflow/graphql-types";
import { Effect } from "../../../connectors/undo-store";
import {
  addLabelToImageInCache,
  removeLabelFromImageCache,
} from "../openlayers-map/draw-bounding-box-and-polygon-interaction/create-label-effect";
import { getDatasetsQuery } from "../../../pages/local/datasets";

const deleteLabelMutation = gql`
  mutation deleteLabel($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
      x
      y
      width
      height
      imageId
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

const createLabelWithIdMutation = gql`
  mutation createLabel(
    $id: ID!
    $imageId: ID!
    $labelClassId: ID
    $geometry: GeometryInput!
  ) {
    createLabel(
      data: {
        id: $id
        imageId: $imageId
        labelClassId: $labelClassId
        geometry: $geometry
      }
    ) {
      id
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
      refetchQueries: ["countLabels", { query: getDatasetsQuery }],
      /* Note that there is no optimistic response here, only a cache update.
       * We could add it but it feels like premature optimization */
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
      | "width"
      | "height"
      | "imageId"
      | "labelClass"
      | "geometry"
    >
  ) => {
    const { id: labelId, imageId, geometry } = deletedLabel;
    const labelClassId = deletedLabel?.labelClass?.id;

    const createLabelInputs = {
      id: labelId,
      imageId,
      labelClassId,
      geometry: omit(["__typename"], geometry),
    };

    /* It is important to use the same id for the re-creation when the label
     * was created in the current session to enable the undoing of the creation effect */
    const { data } = await client.mutate({
      mutation: createLabelWithIdMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabels", { query: getDatasetsQuery }],
      optimisticResponse: { createLabel: { id: labelId, __typename: "Label" } },
      update(cache) {
        addLabelToImageInCache(cache, createLabelInputs);
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);
    return data.createLabel.id;
  },
  redo: async (labelId: string) => {
    const { data } = await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id: labelId },
      refetchQueries: ["countLabels", { query: getDatasetsQuery }],
      /* Note that there is no optimistic response here, only a cache update.
       * We could add it but it feels like premature optimization */
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
});
