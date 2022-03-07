import { gql, useQuery } from "@apollo/client";
import { useDebounce } from "use-debounce";
import {
  LabelClassExistsQuery,
  LabelClassExistsQueryVariables,
} from "../../../graphql-types/LabelClassExistsQuery";

export const LABEL_CLASS_EXISTS_QUERY = gql`
  query LabelClassExistsQuery($datasetId: ID!, $name: String!) {
    labelClassExists(where: { datasetId: $datasetId, name: $name })
  }
`;

export const useLabelClassExists = (
  datasetId: string,
  name: string,
  skip: boolean
) => {
  const [debouncedName] = useDebounce(name, 200, {
    leading: true,
    trailing: true,
  });
  return useQuery<LabelClassExistsQuery, LabelClassExistsQueryVariables>(
    LABEL_CLASS_EXISTS_QUERY,
    {
      fetchPolicy: "network-only",
      variables: { datasetId, name },
      skip: skip || !datasetId || !name || name !== debouncedName,
    }
  );
};
