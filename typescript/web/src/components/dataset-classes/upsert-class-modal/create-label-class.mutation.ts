import {
  gql,
  MutationResult,
  useApolloClient,
  useMutation,
} from "@apollo/client";
import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import { getNextClassColor, LABEL_CLASS_COLOR_PALETTE } from "@labelflow/utils";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import {
  GetDatasetLabelClassesQuery,
  GetDatasetLabelClassesQueryVariables,
} from "../../../graphql-types/GetDatasetLabelClassesQuery";
import { DATASET_LABEL_CLASSES_QUERY } from "./dataset-label-classes.query";

export const CREATE_LABEL_CLASS_MUTATION = gql`
  mutation CreateLabelClassMutation(
    $id: ID
    $name: String!
    $color: ColorHex
    $datasetId: ID!
  ) {
    createLabelClass(
      data: { name: $name, id: $id, color: $color, datasetId: $datasetId }
    ) {
      id
      name
      color
    }
  }
`;

export const createLabelMutationUpdate = (
  datasetSlug: string,
  workspaceSlug: string
): MutationBaseOptions["update"] => {
  return (cache, { data }) => {
    if (data != null) {
      const { createLabelClass } = data;
      const datasetCacheResult = cache.readQuery<
        GetDatasetLabelClassesQuery,
        GetDatasetLabelClassesQueryVariables
      >({
        query: DATASET_LABEL_CLASSES_QUERY,
        variables: { slug: datasetSlug, workspaceSlug },
      });
      if (datasetCacheResult?.dataset == null) {
        throw new Error(`Missing dataset with slug ${datasetSlug}`);
      }

      const { dataset } = datasetCacheResult;
      const newLabelClass = {
        ...createLabelClass,
        index: dataset.labelClasses.length,
      };
      const updatedLabelClasses = dataset.labelClasses.concat({
        ...newLabelClass,
      });
      const updatedDataset = {
        ...dataset,
        labelClasses: updatedLabelClasses,
      };
      cache.writeQuery({
        query: DATASET_LABEL_CLASSES_QUERY,
        variables: { slug: datasetSlug, workspaceSlug },
        data: { dataset: updatedDataset },
      });
    } else {
      throw new Error("Received null data in update label class name function");
    }
  };
};

export const useCreateLabelClassMutation = (
  workspaceSlug: string,
  datasetSlug: string,
  className: string,
  datasetId: string
): [() => Promise<void>, MutationResult<{}>] => {
  const client = useApolloClient();
  const [createLabelClass, result] = useMutation(CREATE_LABEL_CLASS_MUTATION, {
    update: createLabelMutationUpdate(datasetSlug, workspaceSlug),
  });
  const onCreateLabelClass = useCallback(async () => {
    const { data: queryData } = await client.query<
      GetDatasetLabelClassesQuery,
      GetDatasetLabelClassesQueryVariables
    >({
      query: DATASET_LABEL_CLASSES_QUERY,
      variables: { slug: datasetSlug, workspaceSlug },
    });
    const newClassId = uuid();
    const labelClasses = queryData?.dataset?.labelClasses ?? [];
    const color =
      labelClasses.length < 1
        ? LABEL_CLASS_COLOR_PALETTE[0]
        : getNextClassColor(labelClasses.map((labelClass) => labelClass.color));
    await createLabelClass({
      variables: { id: newClassId, name: className, color, datasetId },
      optimisticResponse: {
        createLabelClass: {
          id: newClassId,
          name: className,
          color,
          datasetId,
          __typeName: "LabelClass",
        },
      },
    });
  }, [
    client,
    datasetSlug,
    workspaceSlug,
    createLabelClass,
    className,
    datasetId,
  ]);
  return [onCreateLabelClass, result];
};
