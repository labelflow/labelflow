import { useState, useEffect } from "react";
import { isEmpty } from "lodash/fp";
import {
  Heading,
  ModalHeader,
  ModalBody,
  Button,
  Text,
} from "@chakra-ui/react";
import { useApolloClient, useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

import { UrlList } from "./url-list";
import { DroppedUrl, UploadStatuses } from "../types";

const createImageFromUrlMutation = gql`
  mutation createImageMutation(
    $externalUrl: String!
    $createdAt: DateTime
    $datasetId: ID!
  ) {
    createImage(
      data: {
        externalUrl: $externalUrl
        createdAt: $createdAt
        datasetId: $datasetId
      }
    ) {
      id
    }
  }
`;

const getDataset = gql`
  query getDataset($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
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
  const { datasetSlug, workspaceSlug } = router?.query;

  /*
   * We need a state with the accepted and reject urls to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [urls, setUrls] = useState<Array<DroppedUrl>>([]);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatuses>({});

  const { data: datasetResult } = useQuery(getDataset, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: typeof datasetSlug !== "string" || typeof workspaceSlug !== "string",
  });

  const datasetId = datasetResult?.dataset.id;

  useEffect(() => {
    if (isEmpty(urls)) return;
    if (!datasetId) return;

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
                  datasetId,
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
  }, [urls, datasetId]);

  return (
    <>
      <ModalHeader textAlign="center" padding="6">
        <Heading as="h2" size="lg" pb="2">
          Invite members
        </Heading>
        <Text fontSize="lg" fontWeight="medium">
          Adding workspace members will give them access to{" "}
          <b>every datasets</b> in the workspace.
        </Text>
      </ModalHeader>

      <ModalBody
        display="flex"
        pt="0"
        pb="6"
        pr="6"
        pl="6"
        flexDirection="column"
      >
        {isEmpty(urls) ? (
          <UrlList onDropEnd={setUrls} />
        ) : (
          <UrlList onDropEnd={setUrls} />
        )}
      </ModalBody>
    </>
  );
};