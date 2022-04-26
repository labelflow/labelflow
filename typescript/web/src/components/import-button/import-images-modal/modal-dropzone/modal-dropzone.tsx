import { useApolloClient, useQuery } from "@apollo/client";
import {
  Button,
  Heading,
  ModalBody,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import { useCallback, useEffect, useState } from "react";
import {
  GetDatasetBySlugQuery,
  GetDatasetBySlugQueryVariables,
} from "../../../../graphql-types/GetDatasetBySlugQuery";
import { useDataset, useWorkspace } from "../../../../hooks";
import { flushPaginatedImagesCache } from "../../../dataset-images-list";
import { GET_DATASET_BY_SLUG_QUERY } from "../../../datasets/datasets.query";
import { DroppedFile, UploadInfoRecord } from "../types";
import { Dropzone } from "./dropzone";
import { FilesStatuses } from "./file-statuses";
import { importDroppedFiles } from "./import-dropped-files";

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
  const { id: workspaceId, slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();
  /*
   * We need a state with the accepted and reject files to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [files, setFiles] = useState<Array<DroppedFile>>([]);
  const [uploadInfo, setUploadInfo] = useState<UploadInfoRecord>({});

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

  const datasetId = datasetResult?.dataset.id;

  const handleImport = useCallback(
    async (filesToImport: DroppedFile[]) => {
      if (isNil(datasetId)) return;
      onUploadStart();
      await flushPaginatedImagesCache(apolloClient, datasetId);
      await importDroppedFiles({
        files: filesToImport,
        workspaceId,
        datasetId,
        setUploadInfo,
        apolloClient,
      });
      onUploadEnd();
    },
    [
      workspaceId,
      datasetId,
      setUploadInfo,
      apolloClient,
      onUploadStart,
      onUploadEnd,
    ]
  );

  useEffect(() => {
    if (isEmpty(files) || !datasetId) return;
    handleImport(files);
  }, [files, datasetId, handleImport]);

  return (
    <>
      <ModalHeader textAlign="center" padding="6">
        <Heading as="h2" size="lg" pb="2">
          Import
        </Heading>
        <Text fontSize="lg" fontWeight="medium">
          Start working with your images and annotation files.
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
          <FilesStatuses files={files} uploadInfo={uploadInfo} />
        )}
      </ModalBody>
    </>
  );
};
