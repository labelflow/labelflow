import { useState, useEffect } from "react";
import { isEmpty } from "lodash/fp";
import {
  Heading,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { useApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { UrlList } from "./url-list";
import { UrlStatuses } from "./url-statuses";
import { DroppedUrl, UploadStatuses } from "../types";

const createImageFromUrlMutation = gql`
  mutation createImageMutation($url: String!) {
    createImage(data: { url: $url }) {
      id
    }
  }
`;

export const ImportImagesModalUrlList = ({
  isOpen = false,
  onClose = () => {},
  setMode = () => {},
  isCloseable = false,
  setCloseable = (t: boolean) => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
  setMode?: (mode: string) => {};
}) => {
  const apolloClient = useApolloClient();

  /*
   * We need a state with the accepted and reject files to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [files, setFiles] = useState<Array<DroppedUrl>>([]);
  const [fileUploadStatuses, setFileUploadStatuses] = useState<UploadStatuses>(
    {}
  );

  useEffect(() => {
    if (isEmpty(files)) return;

    const createImages = async () => {
      await Promise.all(
        files
          .filter((file) => isEmpty(file.errors))
          .map(async (acceptedUrl) => {
            try {
              await apolloClient.mutate({
                mutation: createImageFromUrlMutation,
                variables: {
                  url: acceptedUrl,
                },
              });

              setFileUploadStatuses((previousFileUploadStatuses) => {
                return {
                  ...previousFileUploadStatuses,
                  fake: true,
                };
              });
            } catch (err) {
              setFileUploadStatuses((previousFileUploadStatuses) => {
                return {
                  ...previousFileUploadStatuses,
                  fake: err.message,
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
          Import images by listing file URLs, one per line. Stay in control of
          your data. Images are not uploaded on LabelFlow servers.
          <Button
            colorScheme="brand"
            variant="link"
            fontSize="lg"
            fontWeight="medium"
            onClick={() => setMode("dropzone")}
          >
            Import by dropping your files instead
          </Button>
        </Text>
      </ModalHeader>
      <ModalCloseButton disabled={!isCloseable} />
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
          <UrlList onDropEnd={setFiles} />
        ) : (
          !isEmpty(files) && (
            <UrlStatuses
              files={files}
              fileUploadStatuses={fileUploadStatuses}
            />
          )
        )}
      </ModalBody>
    </>
  );
};
