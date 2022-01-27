import { gql } from "@apollo/client";

export const imageQuery = gql`
  query getImage($id: ID!) {
    image(where: { id: $id }) {
      id
      url
      width
      height
    }
  }
`;

export const labelQuery = gql`
  query getLabelIdSmartTool($id: ID!) {
    label(where: { id: $id }) {
      id
      smartToolInput
    }
  }
`;
