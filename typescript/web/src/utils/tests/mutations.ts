import { gql } from "@apollo/client";

export const CREATE_TEST_DATASET_MUTATION = gql`
  mutation CreateTestDatasetMutation(
    $datasetId: ID
    $name: String!
    $workspaceSlug: String!
  ) {
    createDataset(
      data: { id: $datasetId, name: $name, workspaceSlug: $workspaceSlug }
    ) {
      id
      name
      slug
    }
  }
`;

export const CREATE_TEST_IMAGE_MUTATION = gql`
  mutation CreateImageForTestsMutation(
    $url: String
    $id: ID
    $name: String
    $datasetId: ID!
    $width: Int
    $height: Int
    $file: Upload
  ) {
    createImage(
      data: {
        url: $url
        id: $id
        name: $name
        datasetId: $datasetId
        width: $width
        height: $height
        file: $file
      }
    ) {
      id
      name
      width
      height
      url
      thumbnail100Url
      thumbnail200Url
      thumbnail500Url
    }
  }
`;

export const CREATE_LOCAL_TEST_DATASET_MUTATION = gql`
  mutation CreateLocalTestDatasetMutation {
    createDataset(data: { name: "Toto", workspaceSlug: "local" }) {
      id
    }
  }
`;
