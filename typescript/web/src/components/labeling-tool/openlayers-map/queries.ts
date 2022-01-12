import { gql } from "@apollo/client";

export const getLabelClassesOfDatasetQuery = gql`
  query getLabelClassesOfDataset($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      labelClasses {
        id
        name
        color
      }
    }
  }
`;

export const getLabelQuery = gql`
  query getLabelWithLabelClass($id: ID!) {
    label(where: { id: $id }) {
      id
      type
      labelClass {
        id
        name
        color
      }
    }
  }
`;

export const getImageLabelsQuery = gql`
  query getImageLabels($imageId: ID!) {
    image(where: { id: $imageId }) {
      id
      width
      height
      labels {
        type
        id
        x
        y
        width
        height
        labelClass {
          id
          name
          color
        }
        geometry {
          type
          coordinates
        }
      }
    }
  }
`;

export const labelClassQuery = gql`
  query getLabelClass($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
      color
    }
  }
`;
