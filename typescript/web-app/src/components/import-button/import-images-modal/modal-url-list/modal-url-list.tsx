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
import { useRouter } from "next/router";

import { UrlList } from "./url-list";
import { UrlStatuses } from "./url-statuses";
import { DroppedUrl, UploadStatuses } from "../types";

const createImageFromUrlMutation = gql`
  mutation createImageMutation(
    $externalUrl: String!
    $createdAt: DateTime
    $projectId: ID!
  ) {
    createImage(
      data: {
        externalUrl: $externalUrl
        createdAt: $createdAt
        projectId: $projectId
      }
    ) {
      id
    }
  }
`;

export const ImportImagesModalUrlList = ({
  setMode = () => {},
  onUploadStart = () => {},
  onUploadEnd = () => {},
}: {
  setMode?: (mode: "dropzone", updateType?: "replaceIn") => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}) => {
  const apolloClient = useApolloClient();

  const router = useRouter();
  const { projectId } = router?.query;

  /*
   * We need a state with the accepted and reject urls to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [urls, setUrls] = useState<Array<DroppedUrl>>([]);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatuses>({});

  useEffect(() => {
    if (isEmpty(urls)) return;

    if (!projectId) {
      throw new Error(`No project id`);
    }

    const createImages = async () => {
      const now = new Date();
      await Promise.all(
        urls
          .filter((url) => isEmpty(url.errors))
          .map(async (acceptedUrl, index) => {
            try {
              const createdAt = new Date();
              createdAt.setTime(now.getTime() + index);
              await apolloClient.mutate({
                mutation: createImageFromUrlMutation,
                variables: {
                  externalUrl: acceptedUrl.url,
                  createdAt: createdAt.toISOString(),
                  projectId,
                },
              });

              setUploadStatuses((previousUploadStatuses) => {
                return {
                  ...previousUploadStatuses,
                  [acceptedUrl.url]: true,
                };
              });
            } catch (err) {
              setUploadStatuses((previousUploadStatuses) => {
                return {
                  ...previousUploadStatuses,
                  [acceptedUrl.url]: err.message,
                };
              });
            }
          })
      );
      onUploadEnd();
    };

    onUploadStart();
    createImages();
  }, [urls]);

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
            onClick={() => setMode("dropzone", "replaceIn")}
          >
            Import by dropping your files instead
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
        {isEmpty(urls) ? (
          <UrlList onDropEnd={setUrls} />
        ) : (
          <UrlStatuses urls={urls} uploadStatuses={uploadStatuses} />
        )}
      </ModalBody>
    </>
  );
};
