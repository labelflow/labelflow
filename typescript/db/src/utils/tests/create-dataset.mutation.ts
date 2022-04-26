import { gql } from "@apollo/client";
import { client } from "../../dev/apollo-client";

export const CREATE_DATASET_MUTATION = gql`
  mutation createDataset(
    $datasetId: String
    $name: String!
    $workspaceSlug: String!
  ) {
    createDataset(
      data: { id: $datasetId, name: $name, workspaceSlug: $workspaceSlug }
    ) {
      id
      name
    }
  }
`;

export const createDataset = (
  name: string,
  workspaceSlug: string,
  datasetId?: string | null
) =>
  client.mutate({
    mutation: CREATE_DATASET_MUTATION,
    variables: {
      name,
      datasetId,
      workspaceSlug,
    },
    fetchPolicy: "no-cache",
  });
