import { useCallback, useState, useEffect } from "react";
import {
  useDropzone,
  FileRejection,
  FileWithPath,
  FileError,
} from "react-dropzone";
import {
  RiUploadCloud2Line,
  RiImageLine,
  RiFile3Line,
  RiCheckboxCircleFill,
  RiContrastFill,
} from "react-icons/ri";
import { isEmpty } from "lodash/fp";
import {
  chakra,
  Box,
  Stack,
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

const UploadIcon = chakra(RiUploadCloud2Line);
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
  onImportSucceed,
  isOpen = false,
  onClose = () => {},
}: {
  onImportSucceed: (images: Array<File>) => void;
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    onImportSucceed(acceptedFiles);
  }, []);

  const apolloClient = useApolloClient();
  /*
   * We need a state with the accepted and reject files to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [{ acceptedFiles, fileRejections }, setDropzoneResult] = useState<{
    acceptedFiles: Array<FileWithPath>;
    fileRejections: Array<FileRejection>;
  }>({ acceptedFiles: [], fileRejections: [] });
  const [fileUploadStatuses, setFileUploadStatuses] = useState<{
    [key: string]: boolean;
  }>({});

  const dropzoneResult = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/bmp",
  });

  useEffect(() => {
    if (
      isEmpty(dropzoneResult.acceptedFiles) &&
      isEmpty(dropzoneResult.fileRejections)
    )
      return;

    setDropzoneResult({
      acceptedFiles: dropzoneResult.acceptedFiles,
      fileRejections: dropzoneResult.fileRejections,
    });
  }, [dropzoneResult.acceptedFiles, dropzoneResult.fileRejections]);

  const rootProps = {
    ...dropzoneResult.getRootProps(),
    /* There is a problem of event propagation causing the file explorer to open twice when you use click rather than drag and drop.
     * We applied the following workaround: https://github.com/react-dropzone/react-dropzone/issues/541#issuecomment-473106192 */
    onClick: (e: any) => {
      e.stopPropagation();
    },
  };

  useEffect(() => {
    if (isEmpty(acceptedFiles)) return;

    acceptedFiles.forEach(async (acceptedFile) => {
      try {
        await apolloClient.mutate({
          mutation: createImageMutation,
          variables: { file: acceptedFile },
        });

        setFileUploadStatuses((previousFileUploadStatuses) => ({
          ...previousFileUploadStatuses,
          [acceptedFile.path ?? acceptedFile.name]: true,
        }));
      } catch (err) {
        // TODO: Spot possibles errors (no more space on disk?)
        /* eslint-disable no-console */
        console.error(err);
      }
    });
  }, [acceptedFiles]);

  const files = [
    ...fileRejections.map(
      ({ file, errors }: { file: FileWithPath; errors: Array<FileError> }) => ({
        path: file.path,
        name: file.name,
        errors,
      })
    ),
    ...acceptedFiles.map(({ path, name }) => ({
      path,
      name,
      errors: [],
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onClose={() => {
        setDropzoneResult({ acceptedFiles: [], fileRejections: [] });
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
          {isEmpty(acceptedFiles) && isEmpty(fileRejections) ? (
            <Stack
              as="form"
              {...rootProps}
              border="1px dashed"
              borderColor="gray.700"
              borderRadius="md"
              bg="gray.50"
              flex="1"
            >
              {/* We make the label taking all the available place in the Stack in order to make
              the whole surface clickable since we prevent the onClick on the dropzone parent (see the comment above) */}
              <chakra.label
                htmlFor="file-uploader"
                color="gray.700"
                fontWeight="700"
                fontSize="lg"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="Center"
                flex="1"
              >
                <UploadIcon fontSize="9xl" color="gray.700" />
                Drop folders or images
                <input {...dropzoneResult.getInputProps()} id="file-uploader" />
              </chakra.label>
            </Stack>
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
                          <Td pl="2" pr="2" fontSize="md">
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
                            <Td>
                              {fileUploadStatuses[path ?? name] ? (
                                <SucceedIcon aria-label="Upload succeed" />
                              ) : (
                                <LoadingIcon aria-label="Loading indicator" />
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
