import { gql } from "@apollo/client";

export const GET_DATASET_BY_ID_QUERY = gql`
  query getDatasetById($id: ID) {
    dataset(where: { id: $id }) {
      id
      name
    }
  }
`;

export const SEARCH_DATASET_BY_SLUG_QUERY = gql`
  query searchDatasetBySlug($slug: String!, $workspaceSlug: String!) {
    searchDataset(
      where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }
    ) {
      id
      slug
    }
  }
`;

export const GET_DATASET_BY_SLUG_QUERY = gql`
  query getDatasetBySlug($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
    }
  }
`;
