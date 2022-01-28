import { gql } from "@apollo/client";

export const DATASET_LABEL_CLASSES_QUERY = gql`
  query GetDatasetLabelClassesQuery($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
      slug
      labelClasses {
        id
        name
        color
      }
    }
  }
`;
