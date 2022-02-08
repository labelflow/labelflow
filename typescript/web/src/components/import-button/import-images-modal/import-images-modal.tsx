import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQueryParam, StringParam, withDefault } from "use-query-params";
import { useApolloClient } from "@apollo/client";
import { ImportImagesModalDropzone } from "./modal-dropzone/modal-dropzone";
import { ImportImagesModalUrlList } from "./modal-url-list/modal-url-list";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../../shared-queries/dataset-images-page.query";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../../shared-queries/workspace-datasets-page.query";
import { useDataset, useWorkspace } from "../../../hooks";

export type ImportImagesModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export const ImportImagesModal = ({
  isOpen = false,
  onClose = () => {},
}: ImportImagesModalProps) => {
  const client = useApolloClient();
  const { isReady } = useRouter();
  const { slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();

  const [isCloseable, setCloseable] = useState(true);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [mode, setMode] = useQueryParam(
    "import-mode",
    withDefault(StringParam, "dropzone")
  );

  useEffect(() => {
    if (isReady && !isOpen) {
      setMode(undefined, "replaceIn");
    }
  }, [isOpen, isReady]);

  useEffect(() => {
    // Manually refetch
    if (hasUploaded) {
      client.query({
        query: DATASET_IMAGES_PAGE_DATASET_QUERY,
        variables: {
          slug: datasetSlug,
          workspaceSlug,
        },
        fetchPolicy: "network-only",
      });
      client.query({
        query: WORKSPACE_DATASETS_PAGE_DATASETS_QUERY,
        fetchPolicy: "network-only",
      });
      client.refetchQueries({
        include: [WORKSPACE_DATASETS_PAGE_DATASETS_QUERY],
      });
    }
  }, [hasUploaded]);

  const onUploadStart = useCallback(() => {
    setCloseable(false);
  }, []);

  const onUploadEnd = useCallback(() => {
    setCloseable(true);
    setHasUploaded(true);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      scrollBehavior="inside"
      onClose={() => {
        if (!isCloseable) return;
        onClose();
        setHasUploaded(false);
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent height="80vh" data-testid="import-images-modal-content">
        <ModalCloseButton disabled={!isCloseable} />
        {mode !== "url-list" && (
          <ImportImagesModalDropzone
            setMode={setMode}
            onUploadStart={onUploadStart}
            onUploadEnd={onUploadEnd}
          />
        )}
        {mode === "url-list" && (
          <ImportImagesModalUrlList
            setMode={setMode}
            onUploadStart={onUploadStart}
            onUploadEnd={onUploadEnd}
          />
        )}

        <ModalFooter>
          {hasUploaded && (
            <Button
              colorScheme="brand"
              onClick={() => {
                onClose();
                setHasUploaded(false);
              }}
            >
              Start labeling
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
