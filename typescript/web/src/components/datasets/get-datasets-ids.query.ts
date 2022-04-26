import { gql } from "@apollo/client";

export const GET_DATASETS_IDS_QUERY = gql`
  query GetDatasetsIds($where: DatasetWhereInput) {
    datasets(where: $where) {
      id
    }
  }
`;
