import { gql } from "@apollo/client";

export const USER_QUERY = gql`
  query getUserProfileInfo($id: ID!) {
    user(where: { id: $id }) {
      id
      createdAt
      name
      email
      image
    }
  }
`;

export const GET_DATASETS_QUERY = gql`
  query getDatasets($where: DatasetWhereInput) {
    datasets(where: $where) {
      id
      name
      slug
      images(first: 1) {
        id
        url
        thumbnail500Url
      }
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labelClassesAggregates {
        totalCount
      }
    }
  }
`;
