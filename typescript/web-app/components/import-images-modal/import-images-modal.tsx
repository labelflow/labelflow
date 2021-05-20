import { useCallback, useState, useEffect } from "react";
import { useDropzone, FileRejection, FileWithPath } from "react-dropzone";
import { RiUploadCloud2Line } from "react-icons/ri";
import { isEmpty } from "lodash";
import {
  chakra,
  Stack,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

const UploadIcon = chakra(RiUploadCloud2Line);

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
  const [{ acceptedFiles, fileRejections }, setDropzoneResult] = useState<{
    acceptedFiles: Array<FileWithPath>;
    fileRejections: Array<FileRejection>;
  }>({ acceptedFiles: [], fileRejections: [] });

  const dropzoneResult = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/bmp",
  });

  useEffect(() => {
    if (!dropzoneResult.acceptedFiles && !dropzoneResult.fileRejections) return;
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
        <ModalBody display="flex" pt="0" pb="6" pr="6" pl="6">
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
              the all surface clickable since we prevent the onClick on the dropzone parent (see the comment above) */}
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
            <>
              {!isEmpty(fileRejections) && (
                <section>
                  <h3>{fileRejections.length} items rejected</h3>
                  <ul>
                    {fileRejections.map((rejection) => {
                      // Type fix until the following issue is fixed: [insert link here]
                      // @ts-ignore
                      const { path } = rejection.file;
                      return (
                        <li key={path}>
                          <span>{path}</span>
                          <span
                            title={rejection.errors
                              .map((e) => e.message)
                              .join(". ")}
                          >
                            {rejection.errors.length} errors
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {!isEmpty(acceptedFiles) && (
                <section>
                  <h3>Uploading {acceptedFiles.length} items</h3>
                  <ul>
                    {acceptedFiles.map((f) => (
                      <li key={f.path}>{f.path}</li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
