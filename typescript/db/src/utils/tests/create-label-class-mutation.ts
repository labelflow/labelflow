import { gql } from "@apollo/client";
import { client } from "../../dev/apollo-client";

export const createLabelClass = async (data: {
  name: string;
  color: string;
  datasetId: string;
  id?: string;
}) => {
  const {
    data: {
      createLabelClass: { id },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createLabelClass($data: LabelClassCreateInput!) {
        createLabelClass(data: $data) {
          id
        }
      }
    `,
    variables: {
      data,
    },
  });
  return id;
};
