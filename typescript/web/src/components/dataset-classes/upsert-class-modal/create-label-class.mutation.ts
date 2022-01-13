import {
  DocumentNode,
  gql,
  MutationResult,
  useApolloClient,
  useMutation,
} from "@apollo/client";
import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import { Query } from "@labelflow/graphql-types";
import { getNextClassColor, LABEL_CLASS_COLOR_PALETTE } from "@labelflow/utils";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";
import { CREATE_WORKSPACE_MUTATION } from "../../workspace-switcher/create-workspace-modal/create-workspace.mutation";
import { DATASET_LABEL_CLASSES_QUERY } from "./dataset-label-classes.query";

export const CREATE_LABEL_CLASS_MUTATION = gql`
  mutation createLabelClass(
    $id: ID!
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

export const createLabelMutationUpdate: (
  datasetLabelClassesQuery: DocumentNode,
  datasetSlug: string | undefined,
  workspaceSlug: string | undefined
) => MutationBaseOptions["update"] = (
  datasetLabelClassesQuery,
  datasetSlug,
  workspaceSlug
) => {
  return (cache, { data }) => {
    if (data != null) {
      const { createLabelClass } = data;
      const datasetCacheResult = cache.readQuery<Pick<Query, "dataset">>({
        query: datasetLabelClassesQuery,
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
        query: datasetLabelClassesQuery,
        variables: { slug: datasetSlug, workspaceSlug },
        data: { dataset: updatedDataset },
      });
    } else {
      throw new Error("Received null data in update label class name function");
    }
  };
};

export const useCreateLabelClassMutation = (
  workspaceSlug: string | undefined,
  datasetSlug: string | undefined,
  className: string,
  datasetId: string | undefined | null
): [() => Promise<void>, MutationResult<{}>] => {
  const client = useApolloClient();
  const [createLabelClass, result] = useMutation(CREATE_WORKSPACE_MUTATION, {
    update: createLabelMutationUpdate(
      DATASET_LABEL_CLASSES_QUERY,
      datasetSlug,
      workspaceSlug
    ),
  });
  const onCreateLabelClass = useCallback(async () => {
    const { data: queryData } = await client.query<
      Partial<Pick<Query, "dataset">>
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
      mutation: CREATE_LABEL_CLASS_MUTATION,
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
