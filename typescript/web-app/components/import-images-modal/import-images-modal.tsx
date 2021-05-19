import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { isEmpty } from "lodash";

export const ImportImagesModal = ({
  onImportSucceed,
}: {
  onImportSucceed: (images: Array<File>) => void;
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    onImportSucceed(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
  });

  return (
    <section>
      {isEmpty(acceptedFiles) ? (
        <div {...getRootProps()}>
          <label htmlFor="file-uploader">
            Drop folders or images
            <input {...getInputProps()} id="file-uploader" />
          </label>
        </div>
      ) : (
        <aside>Uploading {acceptedFiles.length} items</aside>
      )}
    </section>
  );
};
