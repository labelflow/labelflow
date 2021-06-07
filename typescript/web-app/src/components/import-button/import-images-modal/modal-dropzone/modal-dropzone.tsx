/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { isEmpty } from "lodash/fp";
import {
  Heading,
  ModalHeader,
  ModalBody,
  Button,
  Text,
} from "@chakra-ui/react";
import { useApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { Dropzone } from "./dropzone";
import { FilesStatuses } from "./file-statuses";
import { DroppedFile, UploadStatuses } from "../types";

const createImageFromFileMutation = gql`
  mutation createImageMutation($file: Upload!) {
    createImage(data: { file: $file }) {
      id
    }
  }
`;

export const ImportImagesModalDropzone = ({
  setMode,
  setCloseable = () => {},
}: {
  setMode?: (mode: "urlList") => void;
  setCloseable?: (_t: boolean) => void;
}) => {
  const apolloClient = useApolloClient();

  /*
   * We need a state with the accepted and reject files to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [files, setFiles] = useState<Array<DroppedFile>>([]);
  const [fileUploadStatuses, setFileUploadStatuses] = useState<UploadStatuses>(
    {}
  );

  useEffect(() => {
    if (isEmpty(files)) return;

    const createImages = async () => {
      await Promise.all(
        files
          .filter((file) => isEmpty(file.errors))
          .map(async (acceptedFile) => {
            try {
              await apolloClient.mutate({
                mutation: createImageFromFileMutation,
                variables: { file: acceptedFile.file },
              });

              setFileUploadStatuses((previousFileUploadStatuses) => {
                return {
                  ...previousFileUploadStatuses,
                  [acceptedFile.file.path ?? acceptedFile.file.name]: true,
                };
              });
            } catch (err) {
              setFileUploadStatuses((previousFileUploadStatuses) => {
                return {
                  ...previousFileUploadStatuses,
                  [acceptedFile.file.path ?? acceptedFile.file.name]:
                    err.message,
                };
              });
            }
          })
      );
      setCloseable(true);
    };

    setCloseable(false);
    createImages();
  }, [files]);

  useEffect(() => {
    return () => {
      setFiles([]);
      setFileUploadStatuses({});
    };
  }, []);

  return (
    <>
      <ModalHeader textAlign="center" padding="6">
        <Heading as="h2" size="lg" pb="2">
          Import
        </Heading>
        <Text fontSize="lg" fontWeight="medium">
          Start working with your images. Stay in control of your data. Images
          are not uploaded on LabelFlow servers.{" "}
          <Button
            colorScheme="brand"
            variant="link"
            fontSize="lg"
            fontWeight="medium"
            onClick={() => setMode?.("urlList")}
          >
            Import from a list of URLs instead
          </Button>
        </Text>
      </ModalHeader>

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
          <Dropzone onDropEnd={setFiles} />
        ) : (
          !isEmpty(files) && (
            <FilesStatuses
              files={files}
              fileUploadStatuses={fileUploadStatuses}
            />
          )
        )}
      </ModalBody>
    </>
  );
};
