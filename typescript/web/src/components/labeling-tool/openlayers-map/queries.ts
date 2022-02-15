import { gql } from "@apollo/client";

export const GET_LABEL_CLASSES_OF_DATASET_QUERY = gql`
  query GetLabelClassesOfDatasetQuery($slug: String!, $workspaceSlug: String!) {
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

export const GET_LABEL_QUERY = gql`
  query GetLabelWithLabelClassQuery($id: ID!) {
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

export const GET_IMAGE_LABELS_QUERY = gql`
  query GetImageLabelsQuery($imageId: ID!) {
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
        smartToolInput
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
  query GetLabelClassQuery($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
      color
    }
  }
`;
