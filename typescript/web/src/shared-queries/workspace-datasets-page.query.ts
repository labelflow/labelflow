import { gql } from "@apollo/client";

export const WORKSPACE_DATASETS_PAGE_DATASETS_QUERY = gql`
  query WorkspaceDatasetsPageDatasetsQuery(
    $where: DatasetWhereInput
    $first: Int!
    $skip: Int!
  ) {
    datasets(where: $where, first: $first, skip: $skip) {
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
