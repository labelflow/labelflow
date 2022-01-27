import { gql } from "@apollo/client";

export const GET_DATASET_BY_ID_QUERY = gql`
  query GetDatasetByIdQuery($id: ID) {
    dataset(where: { id: $id }) {
      id
      name
    }
  }
`;

export const SEARCH_DATASET_BY_SLUG_QUERY = gql`
  query SearchDatasetBySlugQuery($slug: String!, $workspaceSlug: String!) {
    searchDataset(
      where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }
    ) {
      id
      slug
    }
  }
`;

export const GET_DATASET_BY_SLUG_QUERY = gql`
  query GetDatasetBySlugQuery($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
    }
  }
`;
