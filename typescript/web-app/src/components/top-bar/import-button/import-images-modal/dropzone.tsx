import { useEffect } from "react";
import { chakra, Stack } from "@chakra-ui/react";
import { RiUploadCloud2Line } from "react-icons/ri";
import {
  useDropzone,
  FileWithPath,
  FileError,
  FileRejection,
} from "react-dropzone";
import { isEmpty } from "lodash/fp";
import { DroppedFile } from "./types";

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
    accept: "image/jpeg, image/png, image/bmp",
  });

  useEffect(() => {
    if (isEmpty(acceptedFiles) && isEmpty(fileRejections)) return;

    const files: Array<DroppedFile> = [
      ...fileRejections.map(
        ({
          file,
          errors,
        }: {
          file: FileWithPath;
          errors: Array<FileError>;
        }) => ({
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
        <input {...getInputProps()} id="file-uploader" />
      </chakra.label>
    </Stack>
  );
};
