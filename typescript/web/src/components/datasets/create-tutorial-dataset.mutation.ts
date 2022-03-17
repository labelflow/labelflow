import { gql } from "@apollo/client";

export const CREATE_TUTORIAL_DATASET_MUTATION = gql`
  mutation CreateTutorialDatasetMutation($workspaceSlug: String!) {
    createTutorialDataset(data: { workspaceSlug: $workspaceSlug }) {
      id
    }
  }
`;
