import { useState, useEffect, useRef } from "react";
import { FileError } from "react-dropzone";
import {
  RiImageLine,
  RiFile3Line,
  RiCheckboxCircleFill,
  RiContrastFill,
} from "react-icons/ri";
import { isEmpty } from "lodash/fp";
import {
  chakra,
  Box,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Tbody,
  Tooltip,
  Tr,
  Td,
  Text,
} from "@chakra-ui/react";
import { useApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { Dropzone } from "./dropzone";

const SucceedIcon = chakra(RiCheckboxCircleFill);
const LoadingIcon = chakra(RiContrastFill);

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
  const [files, setFiles] = useState<
    Array<{ name: string; path?: string; errors: Array<FileError> }>
  >([]);
  const [fileUploadStatuses, setFileUploadStatuses] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (isEmpty(files)) return;

    files
      .filter((file) => isEmpty(file.errors))
      .forEach(async (acceptedFile) => {
        try {
          await apolloClient.mutate({
            mutation: createImageMutation,
            variables: { file: acceptedFile },
          });

          /**
           * If the modal is closed we still want to create images but
           * we don't want to update the state of an unmounted component
           */
          if (isMounted.current) {
            setFileUploadStatuses((previousFileUploadStatuses) => ({
              ...previousFileUploadStatuses,
              [acceptedFile.path ?? acceptedFile.name]: true,
            }));
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
            <Dropzone
              onDropEnd={(
                droppedFiles: Array<{
                  name: string;
                  path?: string;
                  errors: Array<FileError>;
                }>
              ) => setFiles(droppedFiles)}
            />
          ) : (
            !isEmpty(files) && (
              <>
                <Box p="2" bg="gray.200" borderTopRadius="md">
                  <Text>Uploading {files.length} items</Text>
                </Box>
                <Box as="section" overflowY="auto">
                  <Table size="sm" variant="stripped">
                    <Tbody>
                      {files.map(({ path, name, errors }, index) => (
                        <Tr
                          key={path}
                          bg={index % 2 === 0 ? "gray.50" : "inherit"}
                        >
                          <Td pl="2" pr="2" fontSize="xl">
                            {isEmpty(errors) ? (
                              <RiImageLine />
                            ) : (
                              <RiFile3Line />
                            )}
                          </Td>
                          <Td pl="0" fontSize="md" lineHeight="md">
                            <Tooltip label={path}>
                              <Text isTruncated maxWidth="sm" textAlign="left">
                                {path}
                              </Text>
                            </Tooltip>
                          </Td>
                          {isEmpty(errors) ? (
                            <Td fontSize="xl" textAlign="right">
                              {fileUploadStatuses[path ?? name] ? (
                                <Tooltip
                                  label="Upload succeed"
                                  placement="left"
                                >
                                  <span>
                                    <SucceedIcon
                                      display="inline-block"
                                      color="green.500"
                                      aria-label="Upload succeed"
                                    />
                                  </span>
                                </Tooltip>
                              ) : (
                                <Tooltip
                                  label="Loading indicator"
                                  placement="left"
                                >
                                  <span>
                                    <LoadingIcon
                                      display="inline-block"
                                      color="gray.800"
                                      aria-label="Loading indicator"
                                    />
                                  </span>
                                </Tooltip>
                              )}
                            </Td>
                          ) : (
                            <Td
                              color="gray.400"
                              fontSize="md"
                              textAlign="right"
                            >
                              <Tooltip
                                label={errors.map((e) => e.message).join(". ")}
                                placement="left"
                              >
                                <Text as="span" color="red.600">
                                  {errors.length} errors
                                </Text>
                              </Tooltip>
                            </Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </>
            )
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
