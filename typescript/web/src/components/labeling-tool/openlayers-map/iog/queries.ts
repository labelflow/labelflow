import { gql } from "@apollo/client";

export const IMAGE_QUERY = gql`
  query GetImageQuery($id: ID!) {
    image(where: { id: $id }) {
      id
      url
      width
      height
    }
  }
`;

export const LABEL_QUERY = gql`
  query GetLabelIdSmartToolQuery($id: ID!) {
    label(where: { id: $id }) {
      id
      smartToolInput
    }
  }
`;
