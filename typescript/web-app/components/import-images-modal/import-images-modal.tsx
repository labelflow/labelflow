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
  const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
    useDropzone({
      onDrop,
      accept: "image/jpeg, image/png, image/bmp",
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
        <>
          <aside>
            Uploading {acceptedFiles.length} items
            {acceptedFiles.map((f) => (
              <div key={f.name}>{f.name}</div>
            ))}
          </aside>
          {!isEmpty(fileRejections) && (
            <aside>
              {fileRejections.length} items rejected
              {fileRejections.map((rejection) => (
                <div key={rejection.file.name}>{rejection.file.name}</div>
              ))}
            </aside>
          )}
        </>
      )}
    </section>
  );
};
