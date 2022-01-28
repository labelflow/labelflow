import { ApolloClient } from "@apollo/client";

import { GeoJSONPolygon } from "ol/format/GeoJSON";
import { v4 as uuid } from "uuid";
import { Effect } from "..";
import { CREATE_LABEL_MUTATION, DELETE_LABEL_MUTATION } from "./shared-queries";
import { createLabelMutationUpdate } from "./cache-updates/create-label-mutation-update";
import { deleteLabelMutationUpdate } from "./cache-updates/delete-label-mutation-update";
import { LabelType } from "../../../graphql-types/globalTypes";

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
      mutation: CREATE_LABEL_MUTATION,
      variables: { data: createLabelInputs },
      refetchQueries: ["CountLabelsOfDatasetQuery"],
      optimisticResponse: {
        createLabel: { id, __typename: "Label" },
      },
      update: createLabelMutationUpdate(createLabelInputs),
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
      mutation: DELETE_LABEL_MUTATION,
      variables: { id },
      refetchQueries: ["CountLabelsOfDatasetQuery"],
      optimisticResponse: { deleteLabel: { id, __typename: "Label" } },
      update: deleteLabelMutationUpdate({
        id,
        imageId,
        labelClassId: selectedLabelClassId,
      }),
    });

    return id;
  },
});
