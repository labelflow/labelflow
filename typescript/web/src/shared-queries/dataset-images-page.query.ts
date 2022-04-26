import { gql } from "@apollo/client";

// This query is used at the root of /${workspaceSlug}/datasets/${datasetSlug}/images
export const DATASET_IMAGES_PAGE_DATASET_QUERY = gql`
  query DatasetImagesPageDatasetQuery($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
      imagesAggregates {
        totalCount
      }
    }
  }
`;
