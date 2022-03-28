import { ApolloCache } from "@apollo/client";
import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import { isNil } from "lodash/fp";
import {
  DeleteManyLabelsByIdMutation,
  DeleteManyLabelsByIdMutationVariables,
  DeleteManyLabelsByIdMutation_deleteManyLabels,
} from "../../../../graphql-types";
import {
  decrementLabelCountInLabelClassCache,
  removeLabelFromImagesCache,
} from "./shared-functions/labels";

export const deleteLabelMutationUpdate = (
  deletedLabelParams: {
    id: string;
    imageId: string;
    labelClassId: string | null | undefined;
  } | null = null
): MutationBaseOptions["update"] => {
  return (cache, { data }) => {
    const { id, imageId, labelClassId } = deletedLabelParams || {
      id: data.deleteLabel.id as string,
      imageId: data.deleteLabel.imageId as string,
      labelClassId: data.deleteLabel.labelClass?.id as string,
    };

    removeLabelFromImagesCache(cache, imageId, id);
    if (labelClassId) {
      decrementLabelCountInLabelClassCache(cache, labelClassId);
    }
  };
};

const getLabelsIdByImage = (
  labels: DeleteManyLabelsByIdMutation_deleteManyLabels[]
): Record<string, string[]> =>
  labels.reduce<Record<string, string[]>>(
    (prevLabels, { id, imageId }) => ({
      ...prevLabels,
      [imageId]: [...(prevLabels[imageId] ?? []), id],
    }),
    {}
  );

const removeLabelsFromImageCache = (
  cache: ApolloCache<any>,
  labels: DeleteManyLabelsByIdMutation_deleteManyLabels[]
): void => {
  const labelsIdByImage = getLabelsIdByImage(labels);
  Object.entries(labelsIdByImage).forEach(([imageId, labelsId]) =>
    labelsId.forEach((id) => removeLabelFromImagesCache(cache, imageId, id))
  );
};

const getLabelsLabelClassesCount = (
  labels: DeleteManyLabelsByIdMutation_deleteManyLabels[]
): Record<string, number> =>
  labels.reduce<Record<string, number>>(
    (prevLabelClassCount, { labelClass }) =>
      isNil(labelClass)
        ? prevLabelClassCount
        : {
            ...prevLabelClassCount,
            [labelClass.id]: (prevLabelClassCount[labelClass.id] ?? 0) + 1,
          },
    {}
  );

const decrementLabelCountsInLabelClassCache = (
  cache: ApolloCache<any>,
  labels: DeleteManyLabelsByIdMutation_deleteManyLabels[]
): void => {
  const labelClassesCount = getLabelsLabelClassesCount(labels);
  Object.entries(labelClassesCount).map(([id, count]) =>
    decrementLabelCountInLabelClassCache(cache, id, count)
  );
};

export const deleteManyLabelsMutationUpdate: MutationBaseOptions<
  DeleteManyLabelsByIdMutation,
  DeleteManyLabelsByIdMutationVariables
>["update"] = (cache, { data }) => {
  if (isNil(data)) return;
  removeLabelsFromImageCache(cache, data.deleteManyLabels);
  decrementLabelCountsInLabelClassCache(cache, data.deleteManyLabels);
};
