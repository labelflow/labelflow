import { useState, useEffect, useCallback } from "react";
import { isEmpty, isNil } from "lodash/fp";
import {
  Heading,
  ModalHeader,
  ModalBody,
  Button,
  Text,
} from "@chakra-ui/react";
import { useApolloClient, useQuery, gql } from "@apollo/client";
import { Dropzone } from "./dropzone";
import { FilesStatuses } from "./file-statuses";
import { DroppedFile, UploadStatuses } from "../types";

import { importDroppedFiles } from "./import-dropped-files";
import { flushPaginatedImagesCache } from "../../../dataset-images-list";
import { GET_DATASET_BY_SLUG_QUERY } from "../../../datasets/datasets.query";
import {
  GetDatasetBySlugQuery,
  GetDatasetBySlugQueryVariables,
} from "../../../../graphql-types/GetDatasetBySlugQuery";
import {
  GetWorkspaceIdQuery,
  GetWorkspaceIdQueryVariables,
} from "../../../../graphql-types/GetWorkspaceIdQuery";
import { useDataset } from "../../../../hooks";

const GET_WORKSPACE_ID_QUERY = gql`
  query GetWorkspaceIdQuery($workspaceSlug: String) {
    workspace(where: { slug: $workspaceSlug }) {
      id
    }
  }
`;

export const ImportImagesModalDropzone = ({
  setMode,
  onUploadStart = () => {},
  onUploadEnd = () => {},
}: {
  setMode?: (mode: "url-list", updateType?: "replaceIn") => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}) => {
  const apolloClient = useApolloClient();
  const { workspaceSlug, datasetSlug } = useDataset();

  /*
   * We need a state with the accepted and reject files to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [files, setFiles] = useState<Array<DroppedFile>>([]);
  const [fileUploadStatuses, setFileUploadStatuses] = useState<UploadStatuses>(
    {}
  );

  const { data: datasetResult } = useQuery<
    GetDatasetBySlugQuery,
    GetDatasetBySlugQueryVariables
  >(GET_DATASET_BY_SLUG_QUERY, {
    variables: {
      slug: datasetSlug,
      workspaceSlug,
    },
    skip: isEmpty(workspaceSlug) || isEmpty(datasetSlug),
  });
  const { data: getWorkspaceIdData } = useQuery<
    GetWorkspaceIdQuery,
    GetWorkspaceIdQueryVariables
  >(GET_WORKSPACE_ID_QUERY, {
    variables: { workspaceSlug },
    skip: isEmpty(workspaceSlug),
  });

  const datasetId = datasetResult?.dataset.id;
  const workspaceId = getWorkspaceIdData?.workspace.id;

  const handleImport = useCallback(
    async (filesToImport: DroppedFile[]) => {
      if (isNil(workspaceId) || isNil(datasetId)) return;
      onUploadStart();
      await flushPaginatedImagesCache(apolloClient, datasetId);
      await importDroppedFiles({
        files: filesToImport,
        workspaceId,
        datasetId,
        setFileUploadStatuses,
        apolloClient,
      });
      onUploadEnd();
    },
    [
      workspaceId,
      datasetId,
      setFileUploadStatuses,
      apolloClient,
      onUploadStart,
      onUploadEnd,
    ]
  );

  useEffect(() => {
    if (isEmpty(files) || !datasetId) return;

    handleImport(files);
  }, [files, datasetId]);

  return (
    <>
      <ModalHeader textAlign="center" padding="6">
        <Heading as="h2" size="lg" pb="2">
          Import
        </Heading>
        <Text fontSize="lg" fontWeight="medium">
          Start working with your images. Stay in control of your data.{" "}
          <Button
            colorScheme="brand"
            variant="link"
            fontSize="lg"
            fontWeight="medium"
            onClick={() => setMode?.("url-list", "replaceIn")}
          >
            Import from a list of URLs instead
          </Button>
        </Text>
      </ModalHeader>

      <ModalBody
        display="flex"
        pt="0"
        pb="6"
        pr="6"
        pl="6"
        flexDirection="column"
      >
        {isEmpty(files) ? (
          <Dropzone onDropEnd={setFiles} />
        ) : (
          <FilesStatuses
            files={files}
            fileUploadStatuses={fileUploadStatuses}
          />
        )}
      </ModalBody>
    </>
  );
};
