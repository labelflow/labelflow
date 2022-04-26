import { useEffect } from "react";
import { chakra, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useDropzone, FileWithPath, FileRejection } from "react-dropzone";
import { isEmpty } from "lodash/fp";
import { validMimeTypesFlatString } from "@labelflow/common-resolvers/src/utils/validate-upload-mime-types";
import { DroppedFile } from "../types";

const UploadIcon = chakra(RiUploadCloud2Line);

export const Dropzone = ({
  onDropEnd,
}: {
  onDropEnd: (images: Array<DroppedFile>) => void;
}) => {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,
  }: {
    acceptedFiles: Array<FileWithPath>;
    fileRejections: Array<FileRejection>;
    getRootProps: () => object;
    getInputProps: () => object;
  } = useDropzone({
    accept: validMimeTypesFlatString,
  });

  useEffect(() => {
    if (isEmpty(acceptedFiles) && isEmpty(fileRejections)) return;

    const files: Array<DroppedFile> = [
      ...fileRejections,
      ...acceptedFiles.map((file) => ({ file, errors: [] })),
    ];

    onDropEnd(files);
  }, [acceptedFiles, fileRejections]);

  const rootProps = {
    ...getRootProps(),
    /* There is a problem of event propagation causing the file explorer to open twice when you use click rather than drag and drop.
     * We applied the following workaround: https://github.com/react-dropzone/react-dropzone/issues/541#issuecomment-473106192 */
    onClick: (e: any) => {
      e.stopPropagation();
    },
  };

  return (
    <Stack
      as="form"
      {...rootProps}
      border="1px dashed"
      borderColor={useColorModeValue("gray.700", "gray.400")}
      borderRadius="md"
      bg={useColorModeValue("gray.50", "gray.800")}
      flex="1"
    >
      {/* We make the label taking all the available place in the Stack in order to make
              the whole surface clickable since we prevent the onClick on the dropzone parent (see the comment above) */}
      <chakra.label
        htmlFor="file-uploader"
        color={useColorModeValue("gray.700", "gray.400")}
        fontWeight="700"
        fontSize={{ base: "md", md: "lg" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        justifyContent="center"
        flex="1"
      >
        <UploadIcon
          fontSize={{ base: "5xl", md: "9xl" }}
          color={useColorModeValue("gray.600", "gray.400")}
        />
        <Text>Drop images and annotations or click to browse</Text>
        <Text
          fontWeight="500"
          fontSize={{ base: "xs", md: "sm" }}
          color="gray.400"
        >
          Supported file types: JPEG, PNG, COCO (JSON)
        </Text>
        <input {...getInputProps()} id="file-uploader" />
      </chakra.label>
    </Stack>
  );
};
