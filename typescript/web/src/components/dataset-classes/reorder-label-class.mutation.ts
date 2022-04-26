import { gql, useMutation } from "@apollo/client";

export const REORDER_LABEL_CLASS_MUTATION = gql`
  mutation ReorderLabelClassMutation($id: ID!, $index: Int!) {
    reorderLabelClass(where: { id: $id }, data: { index: $index }) {
      id
    }
  }
`;

export const useReorderLabelClassMutation = () => {
  return useMutation(REORDER_LABEL_CLASS_MUTATION);
};
