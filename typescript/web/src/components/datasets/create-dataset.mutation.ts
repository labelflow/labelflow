import { gql } from "@apollo/client";

export const CREATE_DATASET_MUTATION = gql`
  mutation CreateDatasetMutation($name: String!, $workspaceSlug: String!) {
    createDataset(data: { name: $name, workspaceSlug: $workspaceSlug }) {
      id
    }
  }
`;
