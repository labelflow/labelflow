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
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { useApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { Dropzone } from "./dropzone";
import { Files } from "./files";
import { DroppedFile, FileUploadStatuses } from "./types";

const createImageFromFileMutation = gql`
  mutation createImageMutation($file: Upload!) {
    createImage(data: { file: $file }) {
      id
    }
  }
`;

const createImageFromUrlMutation = gql`
  mutation createImageMutation($url: String!) {
    createImage(data: { url: $url }) {
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
                mutation: createImageFromFileMutation,
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

  const testurl =
    "https://images.unsplash.com/photo-1593642634443-44adaa06623a?auto=format&fit=crop&w=600&q=80";

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
          <Image src={testurl} h="2rem" />
          <Button
            onClick={async () => {
              try {
                console.log("Let's go");
                await apolloClient.mutate({
                  mutation: createImageFromUrlMutation,
                  variables: {
                    url: testurl,
                  },
                });

                setFileUploadStatuses((previousFileUploadStatuses) => {
                  return {
                    ...previousFileUploadStatuses,
                    fake: true,
                  };
                });
              } catch (err) {
                setFileUploadStatuses((previousFileUploadStatuses) => {
                  return {
                    ...previousFileUploadStatuses,
                    fake: err.message,
                  };
                });
              }
            }}
          >
            Import Fake image from URL
          </Button>
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
