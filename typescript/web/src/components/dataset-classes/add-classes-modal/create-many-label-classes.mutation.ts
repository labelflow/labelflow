import { gql, MutationResult, useMutation } from "@apollo/client";
import { useCallback } from "react";
import {
  CreateManyLabelClassesMutation,
  CreateManyLabelClassesMutationVariables,
} from "../../../graphql-types/CreateManyLabelClassesMutation";

export const CREATE_MANY_LABEL_CLASSES_MUTATION = gql`
  mutation CreateManyLabelClassesMutation(
    $labelClasses: [LabelClassCreateManySingleInput!]!
    $datasetId: ID!
  ) {
    createManyLabelClasses(
      data: { labelClasses: $labelClasses, datasetId: $datasetId }
    ) {
      id
    }
  }
`;

export const useCreateManyLabelClassesMutation = (
  classNames: string[],
  datasetId: string
): [() => Promise<void>, MutationResult<{}>] => {
  const [createLabelClasses, result] = useMutation<
    CreateManyLabelClassesMutation,
    CreateManyLabelClassesMutationVariables
  >(CREATE_MANY_LABEL_CLASSES_MUTATION, {
    update: (cache) => cache.evict({ id: `Dataset:${datasetId}` }),
  });
  const onCreateLabelClasses = useCallback(async () => {
    const newClassesData = classNames.map((name) => ({ name }));
    await createLabelClasses({
      variables: { labelClasses: newClassesData, datasetId },
    });
  }, [classNames, createLabelClasses, datasetId]);
  return [onCreateLabelClasses, result];
};
