import { gql, useQuery } from "@apollo/client";
import { Query, QueryLabelClassExistsArgs } from "@labelflow/graphql-types";
import { useDebounce } from "use-debounce";

export const LABEL_CLASS_EXISTS_QUERY = gql`
  query labelClassExists($datasetId: ID!, $name: String!) {
    labelClassExists(where: { datasetId: $datasetId, name: $name })
  }
`;

export type LabelClassExistsInput = QueryLabelClassExistsArgs["where"];
export type LabelClassExistsResult = Pick<Query, "labelClassExists">;

export const useLabelClassExists = (
  datasetId: string | undefined,
  name: string
) => {
  const [debouncedName] = useDebounce(name, 200, {
    leading: true,
    trailing: true,
  });
  return useQuery<LabelClassExistsResult, LabelClassExistsInput>(
    LABEL_CLASS_EXISTS_QUERY,
    {
      fetchPolicy: "network-only",
      variables: { datasetId, name },
      skip: !datasetId || !name || name !== debouncedName,
    }
  );
};
