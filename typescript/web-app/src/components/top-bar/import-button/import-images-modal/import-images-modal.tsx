import { useState, useEffect } from "react";
import { isEmpty } from "lodash/fp";
import {
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { useApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { Dropzone } from "./dropzone";
import { Files } from "./files";
import { DroppedFile, FileUploadStatuses } from "./types";

const createImageMutation = gql`
  mutation createImageMutation($file: Upload!) {
    createImage(data: { file: $file }) {
      id
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
  const apolloClient = useApolloClient();
  const [isCloseable, setCloseable] = useState(true);
  /*
   * We need a state with the accepted and reject files to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [files, setFiles] = useState<Array<DroppedFile>>([]);
  const [fileUploadStatuses, setFileUploadStatuses] =
    useState<FileUploadStatuses>({});

  useEffect(() => {
    if (isEmpty(files)) return;

    const createImages = async () => {
      await Promise.all(
        files
          .filter((file) => isEmpty(file.errors))
          .map(async (acceptedFile) => {
            try {
              await apolloClient.mutate({
                mutation: createImageMutation,
                variables: { file: acceptedFile.file },
              });

              setFileUploadStatuses((previousFileUploadStatuses) => {
                return {
                  ...previousFileUploadStatuses,
                  [acceptedFile.file.path ?? acceptedFile.file.name]: true,
                };
              });
            } catch (err) {
              setFileUploadStatuses((previousFileUploadStatuses) => {
                return {
                  ...previousFileUploadStatuses,
                  [acceptedFile.file.path ?? acceptedFile.file.name]:
                    err.message,
                };
              });
            }
          })
      );

      setCloseable(true);
    };

    setCloseable(false);
    createImages();
  }, [files]);

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onClose={() => {
        if (!isCloseable) return;
        setFiles([]);
        setFileUploadStatuses({});
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent height="80vh">
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            Import
          </Heading>
          <Text fontSize="lg" fontWeight="medium">
            Start working with your images. Stay in control of your data. Images
            are not uploaded on LabelFlow servers.
          </Text>
        </ModalHeader>
        <ModalCloseButton disabled={!isCloseable} />
        <ModalBody
          display="flex"
          pt="0"
          pb="6"
          pr="6"
          pl="6"
          overflowY="hidden"
          flexDirection="column"
        >
          {isEmpty(files) ? (
            <Dropzone onDropEnd={setFiles} />
          ) : (
            !isEmpty(files) && (
              <Files files={files} fileUploadStatuses={fileUploadStatuses} />
            )
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
