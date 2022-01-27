import { gql } from "@apollo/client";

export const getDatasetByIdQuery = gql`
  query getDatasetById($id: ID) {
    dataset(where: { id: $id }) {
      id
      name
    }
  }
`;

export const searchDatasetBySlugQuery = gql`
  query searchDatasetBySlug($slug: String!, $workspaceSlug: String!) {
    searchDataset(
      where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }
    ) {
      id
      slug
    }
  }
`;

export const getDatasetBySlugQuery = gql`
  query getDatasetBySlug($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
    }
  }
`;
