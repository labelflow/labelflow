import { gql, useMutation, useQuery } from "@apollo/client";
import { isEmpty } from "lodash/fp";
import {
  GetDatasetByIdQuery,
  GetDatasetByIdQueryVariables,
} from "../../graphql-types/GetDatasetByIdQuery";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../shared-queries/workspace-datasets-page.query";
import { DeleteModal } from "../core";
import {
  GET_DATASET_BY_ID_QUERY,
  useFlushPaginatedDatasetsCache,
} from "./datasets.query";

export const DELETE_DATASET_BY_ID_MUTATION = gql`
  mutation DeleteDatasetByIdMutation($id: ID!) {
    deleteDataset(where: { id: $id }) {
      id
    }
  }
`;

export const DeleteDatasetModal = ({
  isOpen = false,
  onClose = () => {},
  datasetId = undefined,
  workspaceSlug,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  datasetId?: string;
  workspaceSlug?: string;
}) => {
  const flushPaginatedDatasets = useFlushPaginatedDatasetsCache(
    workspaceSlug as string
  );
  const { data } = useQuery<GetDatasetByIdQuery, GetDatasetByIdQueryVariables>(
    GET_DATASET_BY_ID_QUERY,
    {
      variables: { id: datasetId ?? "" },
      skip: isEmpty(datasetId),
    }
  );

  const [deleteDatasetMutate, { loading }] = useMutation(
    DELETE_DATASET_BY_ID_MUTATION,
    {
      variables: { id: datasetId },
      refetchQueries: [WORKSPACE_DATASETS_PAGE_DATASETS_QUERY],
      update: (cache) => {
        // Avoid issue https://github.com/labelflow/labelflow/issues/563
        cache.evict({ id: `Dataset:${datasetId}` });
      },
    }
  );

  const deleteDataset = async () => {
    await flushPaginatedDatasets();
    await deleteDatasetMutate();
    onClose();
  };

  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={onClose}
      header={`Delete Dataset ${data?.dataset?.name}`}
      body="Are you sure? Images, Labels and Classes will be deleted. This action cannot be undone."
      deleting={loading}
      onDelete={deleteDataset}
    />
  );
};
