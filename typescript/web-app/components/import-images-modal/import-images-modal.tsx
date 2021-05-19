import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const ImportImagesModal = ({
  onImportSucceed,
}: {
  onImportSucceed: (images: Array<File>) => void;
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    onImportSucceed(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <label htmlFor="file-uploader">
        Drop folders or images
        <input {...getInputProps()} id="file-uploader" />
      </label>
    </div>
  );
};
