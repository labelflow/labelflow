import { useApolloClient, useQuery } from "@apollo/client";
import {
  Button,
  Heading,
  ModalBody,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { useCallback, useEffect, useState } from "react";
import {
  GetDatasetBySlugQuery,
  GetDatasetBySlugQueryVariables,
} from "../../../../graphql-types/GetDatasetBySlugQuery";
import { GET_DATASET_BY_SLUG_QUERY } from "../../../datasets/datasets.query";
import { useDataset, useWorkspace } from "../../../../hooks";
import { DroppedUrl, UploadInfoRecord } from "../types";
import { importUrls } from "./import-urls";
import { UrlList } from "./url-list";
import { UrlStatuses } from "./url-statuses";

export const ImportImagesModalUrlList = ({
  setMode = () => {},
  onUploadStart = () => {},
  onUploadEnd = () => {},
}: {
  setMode?: (mode: "dropzone", updateType?: "replaceIn") => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}) => {
  const apolloClient = useApolloClient();

  const { slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();

  /*
   * We need a state with the accepted and reject urls to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [urls, setUrls] = useState<Array<DroppedUrl>>([]);
  const [uploadInfo, setUploadInfo] = useState<UploadInfoRecord>({});

  const { data: datasetResult } = useQuery<
    GetDatasetBySlugQuery,
    GetDatasetBySlugQueryVariables
  >(GET_DATASET_BY_SLUG_QUERY, {
    variables: { workspaceSlug, slug: datasetSlug },
    skip: isEmpty(workspaceSlug) || isEmpty(datasetSlug),
  });

  const datasetId = datasetResult?.dataset.id;

  const handleImport = useCallback(
    async (urlsToImport: DroppedUrl[]) => {
      onUploadStart();

      await importUrls({
        urls: urlsToImport,
        apolloClient,
        datasetId,
        setUploadInfo,
      });

      onUploadEnd();
    },
    [apolloClient, datasetId, setUploadInfo, onUploadStart, onUploadEnd]
  );

  useEffect(() => {
    if (isEmpty(urls)) return;
    if (!datasetId) return;

    handleImport(urls);
  }, [urls, datasetId]);

  return (
    <>
      <ModalHeader textAlign="center" padding="6">
        <Heading as="h2" size="lg" pb="2">
          Import
        </Heading>
        <Text fontSize="lg" fontWeight="medium">
          Import images by listing file URLs, one per line.
          <Button
            colorScheme="brand"
            display="inline"
            variant="link"
            fontSize="lg"
            fontWeight="medium"
            whiteSpace="normal"
            wordWrap="break-word"
            onClick={() => setMode("dropzone", "replaceIn")}
          >
            Import by dropping your files instead
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
        {isEmpty(urls) ? (
          <UrlList onDropEnd={setUrls} />
        ) : (
          <UrlStatuses urls={urls} uploadInfo={uploadInfo} />
        )}
      </ModalBody>
    </>
  );
};
