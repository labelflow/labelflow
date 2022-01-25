import { gql } from "@apollo/client";

export const createTestDatasetMutation = gql`
  mutation createTestDataset(
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

export const createTestImageMutation = gql`
  mutation createImageForTests(
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

export const createLocalTestDatasetMutation = gql`
  mutation createLocalTestDataset {
    createDataset(data: { name: "Toto", workspaceSlug: "local" }) {
      id
    }
  }
`;
