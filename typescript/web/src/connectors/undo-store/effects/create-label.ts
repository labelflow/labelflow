import { ApolloClient } from "@apollo/client";

import { LabelType } from "@labelflow/graphql-types";
import { GeoJSONPolygon } from "ol/format/GeoJSON";
import { v4 as uuid } from "uuid";
import { Effect } from "..";
import { createLabelMutation, deleteLabelMutation } from "./shared-queries";
import { addLabelToImageInCache } from "./cache-updates/add-label-to-image-in-cache";
import { removeLabelFromImageCache } from "./cache-updates/remove-label-from-image-cache";

export const createCreateLabelEffect = (
  {
    imageId,
    selectedLabelClassId,
    geometry,
    labelType,
  }: {
    imageId: string;
    selectedLabelClassId: string | null;
    geometry: GeoJSONPolygon;
    labelType: LabelType;
  },
  {
    setSelectedLabelId,
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async (id = uuid()) => {
    const createLabelInputs = {
      id,
      imageId,
      labelClassId: selectedLabelClassId,
      geometry,
      type: labelType,
    };

    const createLabelPromise = client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabelsOfDataset"],
      optimisticResponse: {
        createLabel: { id, __typename: "Label" },
      },
      update(cache, { data: mutationPayloadData }) {
        if (typeof mutationPayloadData?.createLabel?.id !== "string") {
          return;
        }

        addLabelToImageInCache(cache, createLabelInputs);
      },
    });

    // TODO: Ideally we could select the label before awaiting for the mutation to complete
    // because the optimistic response is run synchronously.
    // However it makes some query fails. It would be nice to try to reverse those 2 lines
    // and make the other "cache-first"
    await createLabelPromise;
    setSelectedLabelId(id);

    return id;
  },
  undo: async (id: string): Promise<string> => {
    setSelectedLabelId(null);
    await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["countLabelsOfDataset"],
      optimisticResponse: { deleteLabel: { id, __typename: "Label" } },
      update(cache) {
        removeLabelFromImageCache(cache, { imageId, id });
      },
    });

    return id;
  },
});
