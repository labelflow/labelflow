import { gql, useQuery } from "@apollo/client";
import { DatasetClassesQueryResult } from "./types";

export const DATASET_LABEL_CLASSES_QUERY_WITH_COUNT = gql`
  query GetDatasetLabelClassesWithTotalCountQuery(
    $workspaceSlug: String!
    $datasetSlug: String!
  ) {
    dataset(
      where: { slugs: { workspaceSlug: $workspaceSlug, slug: $datasetSlug } }
    ) {
      id
      name
      labelClasses {
        id
        index
        name
        color
        labelsAggregates {
          totalCount
        }
      }
    }
  }
`;

export const useDatasetLabelClassesQuery = (
  workspaceSlug: string,
  datasetSlug: string
) => {
  return useQuery<DatasetClassesQueryResult>(
    DATASET_LABEL_CLASSES_QUERY_WITH_COUNT,
    {
      variables: { workspaceSlug, datasetSlug },
      skip: !datasetSlug,
    }
  );
};

export const GET_LABEL_CLASS_BY_ID_QUERY = gql`
  query GetLabelClassByIdQuery($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
    }
  }
`;
