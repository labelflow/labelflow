import { useState, useEffect, useRef } from "react";
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
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const apolloClient = useApolloClient();
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

    files
      .filter((file) => isEmpty(file.errors))
      .forEach(async (acceptedFile) => {
        try {
          /**
           * We keep track of files that started being uploaded before
           * the modal was closed
           */
          const fileKey = acceptedFile.file.path ?? acceptedFile.file.name;
          if (isMounted.current) {
            setFileUploadStatuses((previousFileUploadStatuses) => ({
              ...previousFileUploadStatuses,
              [fileKey]: false,
            }));
          }

          await apolloClient.mutate({
            mutation: createImageMutation,
            variables: { file: acceptedFile.file },
          });

          /**
           * If the modal is closed we still want to create images but
           * we don't want to update the state of an unmounted component
           */
          if (isMounted.current) {
            setFileUploadStatuses((previousFileUploadStatuses) => {
              if (previousFileUploadStatuses[fileKey] === undefined)
                return previousFileUploadStatuses;
              return {
                ...previousFileUploadStatuses,
                [fileKey]: true,
              };
            });
          }
        } catch (err) {
          // TODO: Spot possibles errors (no more space on disk?)
          /* eslint-disable no-console */
          console.error(err);
        }
      });
  }, [files]);

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onClose={() => {
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
        <ModalCloseButton />
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
