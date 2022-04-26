import { ApolloClient } from "@apollo/client";

import { GeoJSONPolygon } from "ol/format/GeoJSON";
import { v4 as uuid } from "uuid";
import { useLabelingStore } from "../../labeling-state";

import { Effect } from "..";

import { createLabelMutationUpdate } from "./cache-updates/create-label-mutation-update";
import { deleteLabelMutationUpdate } from "./cache-updates/delete-label-mutation-update";
import { createLabelClassMutationUpdate } from "./cache-updates/create-label-class-mutation-update";
import { deleteLabelClassMutationUpdate } from "./cache-updates/delete-label-class-mutation-update";
import {
  CREATE_LABEL_CLASS_QUERY,
  CREATE_LABEL_MUTATION,
  DELETE_LABEL_MUTATION,
  DELETE_LABEL_CLASS_MUTATION,
} from "./shared-queries";
import { LabelType } from "../../../graphql-types/globalTypes";

export const createCreateLabelClassAndCreateLabelEffect = (
  {
    name,
    color,
    datasetId,
    imageId,
    previouslySelectedLabelClassId,
    geometry,
    labelType,
  }: {
    name: string;
    color: string;
    datasetId: string;
    imageId: string;
    previouslySelectedLabelClassId: string | null;
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
  do: async () => {
    const labelId = uuid();
    const labelClassId = uuid();

    await client.mutate({
      mutation: CREATE_LABEL_CLASS_QUERY,
      variables: { data: { name, color, datasetId, id: labelClassId } },
      optimisticResponse: {
        createLabelClass: {
          id: labelClassId,
          name,
          color,
          __typename: "LabelClass",
        },
      },
      update: createLabelClassMutationUpdate(datasetId),
    });

    const createLabelInputs = {
      id: labelId,
      imageId,
      labelClassId,
      geometry,
      type: labelType,
    };
    const { data } = await client.mutate({
      mutation: CREATE_LABEL_MUTATION,
      variables: { data: createLabelInputs },
      refetchQueries: ["CountLabelsOfDatasetQuery"],
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update: createLabelMutationUpdate(createLabelInputs),
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);

    return {
      id: data.createLabel.id,
      labelClassId,
      labelClassIdPrevious: previouslySelectedLabelClassId,
    };
  },
  undo: async ({
    id,
    labelClassId,
    labelClassIdPrevious,
  }: {
    id: string;
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: DELETE_LABEL_MUTATION,
      variables: { id },
      refetchQueries: ["CountLabelsOfDatasetQuery"],
      optimisticResponse: { deleteLabel: { id, __typename: "Label" } },
      update: deleteLabelMutationUpdate({
        id,
        imageId,
        labelClassId,
      }),
    });

    setSelectedLabelId(null);

    await client.mutate({
      mutation: DELETE_LABEL_CLASS_MUTATION,
      variables: {
        where: { id: labelClassId },
      },
      optimisticResponse: {
        deleteLabelClass: { __typename: "LabelClass", id: labelClassId },
      },
      update: deleteLabelClassMutationUpdate(datasetId),
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassIdPrevious });
    return {
      id,
      labelClassId,
      labelClassIdPrevious,
    };
  },
  redo: async ({
    id,
    labelClassId,
    labelClassIdPrevious,
  }: {
    id: string;
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: CREATE_LABEL_CLASS_QUERY,
      variables: { data: { name, color, id: labelClassId, datasetId } },
      update: createLabelClassMutationUpdate(datasetId),
      optimisticResponse: {
        createLabelClass: {
          id: labelClassId,
          name,
          color,
          __typename: "LabelClass",
        },
      },
    });

    const createLabelInputs = {
      id,
      imageId,
      labelClassId,
      geometry,
      type: labelType,
    };
    const { data } = await client.mutate({
      mutation: CREATE_LABEL_MUTATION,
      variables: { data: createLabelInputs },
      refetchQueries: ["CountLabelsOfDatasetQuery"],
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update: createLabelMutationUpdate(createLabelInputs),
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);
    return {
      id,
      labelClassId,
      labelClassIdPrevious,
    };
  },
});
