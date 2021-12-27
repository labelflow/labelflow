import { gql, useQuery } from "@apollo/client";
import { DatasetClassesQueryResult } from "./types";

export const LABEL_CLASSES_QUERY = gql`
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

export const useLabelClassesQuery = (
  workspaceSlug: string,
  datasetSlug: string
) => {
  return useQuery<DatasetClassesQueryResult>(LABEL_CLASSES_QUERY, {
    variables: { workspaceSlug, datasetSlug },
    skip: !datasetSlug,
  });
};
