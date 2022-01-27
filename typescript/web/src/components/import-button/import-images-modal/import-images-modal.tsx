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

export const ImportImagesModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const client = useApolloClient();
  const router = useRouter();
  const { datasetSlug, workspaceSlug } = router?.query;

  const [isCloseable, setCloseable] = useState(true);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [mode, setMode] = useQueryParam(
    "import-mode",
    withDefault(StringParam, "dropzone")
  );

  useEffect(() => {
    if (router?.isReady && !isOpen) {
      setMode(undefined, "replaceIn");
    }
  }, [isOpen, router?.isReady]);

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
      client.refetchQueries({ include: ["PaginatedImagesQuery"] });
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
      <ModalContent height="80vh">
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

        <ModalFooter visibility={hasUploaded ? "visible" : "hidden"}>
          <Button
            colorScheme="brand"
            onClick={() => {
              onClose();
              setHasUploaded(false);
            }}
          >
            Start labeling
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
