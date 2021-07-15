import { useEffect, useState } from "react";
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
import { useQuery, gql } from "@apollo/client";
import { ImportImagesModalDropzone } from "./modal-dropzone/modal-dropzone";
import { ImportImagesModalUrlList } from "./modal-url-list/modal-url-list";

const imagesQuery = gql`
  query getImages {
    images {
      id
      name
      url
    }
  }
`;

export const ImportImagesModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const { refetch: refetchImages } = useQuery(imagesQuery);

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
    if (hasUploaded) {
      refetchImages();
    }
  }, [hasUploaded]);

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
            onUploadStart={() => {
              setCloseable(false);
            }}
            onUploadEnd={() => {
              setCloseable(true);
              setHasUploaded(true);
            }}
          />
        )}
        {mode === "url-list" && (
          <ImportImagesModalUrlList
            setMode={setMode}
            onUploadStart={() => {
              setCloseable(false);
            }}
            onUploadEnd={() => {
              setCloseable(true);
              setHasUploaded(true);
            }}
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
