import { gql } from "@apollo/client";

export const UPDATE_DATASET_MUTATION = gql`
  mutation UpdateDatasetMutation($id: ID!, $name: String!) {
    updateDataset(where: { id: $id }, data: { name: $name }) {
      id
    }
  }
`;
