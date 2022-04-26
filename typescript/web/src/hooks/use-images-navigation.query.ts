import { gql } from "@apollo/client";

export const GET_ALL_IMAGES_OF_A_DATASET_QUERY = gql`
  query GetAllImagesOfADatasetQuery($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      images {
        id
        url
        thumbnail200Url
      }
    }
  }
`;
