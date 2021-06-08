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

import { UploadTarget } from "../../../../graphql-types.generated";

const createImageFromFileMutation = gql`
  mutation createImageMutation($file: Upload!) {
    createImage(data: { file: $file }) {
      id
    }
  }
`;

const createImageFromUrlMutation = gql`
  mutation createImageMutation($url: String!) {
    createImage(data: { url: $url }) {
      id
    }
  }
`;

const getImageUploadTargetMutation = gql`
  mutation getUploadTarget {
    getUploadTarget {
      ... on UploadTargetDirect {
        direct
      }
      ... on UploadTargetHttp {
        uploadUrl
        downloadUrl
      }
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
              // Ask server how to upload image
              const { data } = await apolloClient.mutate({
                mutation: getImageUploadTargetMutation,
              });

              const target: UploadTarget = data.getUploadTarget;

              // eslint-disable-next-line no-underscore-dangle
              if (target.__typename === "UploadTargetDirect") {
                // Direct file upload through graphql upload mutation
                await apolloClient.mutate({
                  mutation: createImageFromFileMutation,
                  variables: { file: acceptedFile.file },
                });

                return setFileUploadStatuses((previousFileUploadStatuses) => {
                  return {
                    ...previousFileUploadStatuses,
                    [acceptedFile.file.path ?? acceptedFile.file.name]: true,
                  };
                });
              }

              // eslint-disable-next-line no-underscore-dangle
              if (target.__typename === "UploadTargetHttp") {
                // File upload to the url provided by the server
                await fetch(target.uploadUrl, {
                  method: "PUT",
                  body: acceptedFile.file,
                });

                await apolloClient.mutate({
                  mutation: createImageFromUrlMutation,
                  variables: { url: target.downloadUrl },
                });

                return setFileUploadStatuses((previousFileUploadStatuses) => {
                  return {
                    ...previousFileUploadStatuses,
                    [acceptedFile.file.path ?? acceptedFile.file.name]: true,
                  };
                });
              }

              throw new Error(
                // eslint-disable-next-line no-underscore-dangle
                `Unrecognized upload target provided by server: ${target.__typename}`
              );
            } catch (err) {
              return setFileUploadStatuses((previousFileUploadStatuses) => {
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
