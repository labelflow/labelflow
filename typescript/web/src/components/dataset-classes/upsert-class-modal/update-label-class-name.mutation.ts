import { gql, useApolloClient } from "@apollo/client";
import { useCallback } from "react";

export const UPDATE_LABEL_CLASS_NAME_MUTATION = gql`
  mutation updateLabelClassName($id: ID!, $name: String!) {
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
) => {
  const client = useApolloClient();
  return useCallback(async () => {
    await client.mutate({
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
  }, [client, classId, className, classColor]);
};
