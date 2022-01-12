import { gql, useQuery } from "@apollo/client";
import { DatasetClassesQueryResult } from "./types";

export const DATASET_LABEL_CLASSES_QUERY = gql`
  query getDatasetLabelClasses($workspaceSlug: String!, $datasetSlug: String!) {
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
  return useQuery<DatasetClassesQueryResult>(DATASET_LABEL_CLASSES_QUERY, {
    variables: { workspaceSlug, datasetSlug },
    skip: !datasetSlug,
  });
};

export const getLabelClassByIdQuery = gql`
  query getLabelClassById($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
    }
  }
`;
