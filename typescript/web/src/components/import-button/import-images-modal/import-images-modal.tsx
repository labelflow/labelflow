import { useApolloClient } from "@apollo/client";
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { GET_ALL_IMAGES_OF_A_DATASET_QUERY } from "../../../hooks/use-images-navigation.query";
import { DATASET_IMAGES_PAGE_DATASET_QUERY } from "../../../shared-queries/dataset-images-page.query";
import { WORKSPACE_DATASETS_PAGE_DATASETS_QUERY } from "../../../shared-queries/workspace-datasets-page.query";
import { PAGINATED_IMAGES_QUERY } from "../../dataset-images-list";
import { ImportImagesModalDropzone } from "./modal-dropzone/modal-dropzone";
import { ImportImagesModalUrlList } from "./modal-url-list/modal-url-list";

export type ImportImagesModalProps = {
  datasetId?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export const ImportImagesModal = ({
  isOpen = false,
  onClose = () => {},
  datasetId,
}: ImportImagesModalProps) => {
  const client = useApolloClient();
  const { isReady } = useRouter();

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
    if (hasUploaded) {
      client.cache.evict({ id: `Dataset:${datasetId}` });
      client.refetchQueries({
        include: [
          WORKSPACE_DATASETS_PAGE_DATASETS_QUERY,
          PAGINATED_IMAGES_QUERY,
          GET_ALL_IMAGES_OF_A_DATASET_QUERY,
          DATASET_IMAGES_PAGE_DATASET_QUERY,
        ],
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
              data-testid="start-labeling-button"
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
