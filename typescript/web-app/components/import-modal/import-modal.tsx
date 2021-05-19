import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const ImportModal = () => {
  const onDrop = useCallback(() => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <label htmlFor="file-uploader">Drop folders or images</label>
      <input {...getInputProps()} id="file-uploader" />
    </div>
  );
};
