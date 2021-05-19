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
    <article>
      <header>
        <h2>Import</h2>
        <p>
          Start working with your images. Stay in control of your data. Images
          are not uploaded on LabelFlow servers.
        </p>
      </header>

      {isEmpty(acceptedFiles) ? (
        <form {...getRootProps()}>
          <label htmlFor="file-uploader">
            Drop folders or images
            <input {...getInputProps()} id="file-uploader" />
          </label>
        </form>
      ) : (
        <>
          <section>
            <h3>Uploading {acceptedFiles.length} items</h3>
            <ul>
              {acceptedFiles.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          </section>

          {!isEmpty(fileRejections) && (
            <section>
              <h3>{fileRejections.length} items rejected</h3>
              <ul>
                {fileRejections.map((rejection) => (
                  <li key={rejection.file.name}>{rejection.file.name}</li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </article>
  );
};
