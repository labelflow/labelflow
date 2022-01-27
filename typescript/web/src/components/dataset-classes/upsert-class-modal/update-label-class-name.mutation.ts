import { gql, MutationResult, useMutation } from "@apollo/client";
import { useCallback } from "react";

export const UPDATE_LABEL_CLASS_NAME_MUTATION = gql`
  mutation UpdateLabelClassNameMutation($id: ID!, $name: String!) {
    updateLabelClass(where: { id: $id }, data: { name: $name }) {
      id
      name
      color
    }
  }
`;

export const useUpdateLabelClass = (
  classId: string | undefined,
  className: string,
  classColor: string | undefined
): [() => Promise<void>, MutationResult<{}>] => {
  const [updateLabelClass, result] = useMutation(
    UPDATE_LABEL_CLASS_NAME_MUTATION
  );
  const onUpdate = useCallback(async () => {
    await updateLabelClass({
      mutation: UPDATE_LABEL_CLASS_NAME_MUTATION,
      variables: { id: classId, name: className },
      optimisticResponse: {
        updateLabelClass: {
          id: classId,
          name: className,
          color: classColor,
          __typeName: "LabelClass",
        },
      },
    });
  }, [updateLabelClass, classId, className, classColor]);
  return [onUpdate, result];
};
