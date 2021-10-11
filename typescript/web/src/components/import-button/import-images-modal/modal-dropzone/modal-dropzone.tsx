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
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";

import {
  ExportFormat,
  UploadTarget,
  // ImportStatus,
} from "@labelflow/graphql-types";
import { Dropzone } from "./dropzone";
import { FilesStatuses } from "./file-statuses";
import { DroppedFile, UploadStatuses } from "../types";

import { browser } from "../../../../utils/detect-scope";

const createImageFromFileMutation = gql`
  mutation createImageMutation(
    $file: Upload!
    $createdAt: DateTime
    $datasetId: ID!
  ) {
    createImage(
      data: { file: $file, createdAt: $createdAt, datasetId: $datasetId }
    ) {
      id
    }
  }
`;

const createImageFromUrlMutation = gql`
  mutation createImageMutation(
    $url: String!
    $createdAt: DateTime
    $name: String!
    $datasetId: ID!
  ) {
    createImage(
      data: {
        url: $url
        createdAt: $createdAt
        name: $name
        datasetId: $datasetId
      }
    ) {
      id
    }
  }
`;

const getImageUploadTargetMutation = gql`
  mutation getUploadTarget($key: String!) {
    getUploadTarget(data: { key: $key }) {
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

const getDataset = gql`
  query getDataset($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
    }
  }
`;

const importDataset = gql`
  mutation importDataset(
    $where: DatasetWhereUniqueInput!
    $data: DatasetImportInput!
  ) {
    importDataset(where: $where, data: $data) {
      error
    }
  }
`;

const encodeFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      resolve(evt?.target?.result as string);
    };
    reader.onerror = reject;
    reader.onabort = reject;
    reader.readAsDataURL(file);
  });
};

const getImageStoreKey = (
  datasetId: string,
  fileId: string,
  mimetype: string
) => `${datasetId}/${fileId}.${mime.extension(mimetype)}`;

export const ImportImagesModalDropzone = ({
  setMode,
  onUploadStart = () => {},
  onUploadEnd = () => {},
}: {
  setMode?: (mode: "url-list", updateType?: "replaceIn") => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}) => {
  const apolloClient = useApolloClient();

  const router = useRouter();
  const { datasetSlug, workspaceSlug } = router?.query;

  /*
   * We need a state with the accepted and reject files to be able to reset the list
   * when we close the modal because react-dropzone doesn't provide a way to reset its
   * internal state
   */
  const [files, setFiles] = useState<Array<DroppedFile>>([]);
  const [fileUploadStatuses, setFileUploadStatuses] = useState<UploadStatuses>(
    {}
  );

  const { data: datasetResult } = useQuery(getDataset, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: typeof datasetSlug !== "string" || typeof workspaceSlug !== "string",
  });

  const datasetId = datasetResult?.dataset.id;

  useEffect(() => {
    if (isEmpty(files)) return;
    if (!datasetId) return;

    const createImages = async () => {
      const now = new Date();
      await Promise.all(
        files
          .filter((file) => isEmpty(file.errors))
          .map(async (acceptedFile, index) => {
            try {
              // Ask server how to upload image
              const { data } = await apolloClient.mutate({
                mutation: getImageUploadTargetMutation,
                variables: {
                  key: getImageStoreKey(
                    datasetId as string,
                    uuidv4(),
                    acceptedFile.file.type
                  ),
                },
              });

              const target: UploadTarget = data.getUploadTarget;

              // eslint-disable-next-line no-underscore-dangle
              if (target.__typename === "UploadTargetDirect") {
                // Direct file upload through graphql upload mutation
                const createdAt = new Date();
                createdAt.setTime(now.getTime() + index);
                await apolloClient.mutate({
                  mutation: createImageFromFileMutation,
                  variables: {
                    file: acceptedFile.file,
                    createdAt: createdAt.toISOString(),
                    datasetId,
                  },
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

                if (browser?.name === "safari") {
                  // This special case is needed for Safari
                  // See https://github.com/labelflow/labelflow/issues/228
                  // See https://stackoverflow.com/questions/63144979/fetch-event-listener-not-triggering-in-service-worker-for-file-upload-via-mult
                  const url = await encodeFileToDataUrl(acceptedFile.file);

                  await apolloClient.mutate({
                    mutation: createImageFromUrlMutation,
                    variables: {
                      url,
                      name: acceptedFile.file.name,
                      datasetId,
                    },
                  });

                  return setFileUploadStatuses((previousFileUploadStatuses) => {
                    return {
                      ...previousFileUploadStatuses,
                      [acceptedFile.file.path ?? acceptedFile.file.name]: true,
                    };
                  });
                }

                const form = new FormData();
                form.append("image", acceptedFile.file);
                await fetch(target.uploadUrl, {
                  method: "PUT",
                  body: form,
                });
                if (acceptedFile.file.type.startsWith("image")) {
                  const createdAt = new Date();
                  createdAt.setTime(now.getTime() + index);
                  await apolloClient.mutate({
                    mutation: createImageFromUrlMutation,
                    variables: {
                      url: target.downloadUrl,
                      createdAt: createdAt.toISOString(),
                      name: acceptedFile.file.name,
                      datasetId,
                    },
                  });
                } else {
                  // It's a dataset / annotations that we want to import
                  const dataImportDataset = await apolloClient.mutate({
                    mutation: importDataset,
                    variables: {
                      where: { id: datasetId },
                      data: {
                        url: target.downloadUrl,
                        format: ExportFormat.Coco,
                        options: {
                          coco: {
                            annotationsOnly:
                              acceptedFile.file.type === "application/json",
                          },
                        },
                      },
                    },
                    refetchQueries: [
                      "getDatasetData",
                      "getImageLabels",
                      "getLabel",
                      "countLabelsOfDataset",
                      "getDatasetLabelClasses",
                    ],
                  });
                  if (dataImportDataset?.data?.importDataset?.error) {
                    throw new Error(
                      dataImportDataset?.data?.importDataset?.error
                    );
                  }
                }

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
      onUploadEnd();
    };

    onUploadStart();
    createImages();
  }, [files, datasetId]);

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
            onClick={() => setMode?.("url-list", "replaceIn")}
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
        flexDirection="column"
      >
        {isEmpty(files) ? (
          <Dropzone onDropEnd={setFiles} />
        ) : (
          <FilesStatuses
            files={files}
            fileUploadStatuses={fileUploadStatuses}
          />
        )}
      </ModalBody>
    </>
  );
};
