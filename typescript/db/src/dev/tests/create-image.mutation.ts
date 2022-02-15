import { gql } from "@apollo/client";

export const CREATE_IMAGE_MUTATION = gql`
  mutation createImageInDbTests(
    $datasetId: ID!
    $file: Upload!
    $name: String!
    $width: Int
    $height: Int
    $imageId: ID
  ) {
    createImage(
      data: {
        id: $imageId
        datasetId: $datasetId
        name: $name
        file: $file
        width: $width
        height: $height
      }
    ) {
      id
    }
  }
`;
