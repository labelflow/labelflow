import { gql } from "@apollo/client";

export const IMAGE_QUERY = gql`
  query getImage($id: ID!) {
    image(where: { id: $id }) {
      id
      url
      width
      height
    }
  }
`;

export const LABEL_QUERY = gql`
  query getLabelIdSmartTool($id: ID!) {
    label(where: { id: $id }) {
      id
      smartToolInput
    }
  }
`;
