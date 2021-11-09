import { gql } from "@apollo/client";

export const labelClassQuery = gql`
  query getLabelClass($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
      color
    }
  }
`;

export const imageQuery = gql`
  query getImage($id: ID!) {
    image(where: { id: $id }) {
      id
      url
    }
  }
`;

export const labelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      smartToolInput
    }
  }
`;
