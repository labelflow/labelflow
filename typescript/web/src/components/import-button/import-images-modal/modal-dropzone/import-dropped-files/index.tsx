/* eslint-disable no-underscore-dangle */

import { ApolloClient } from "@apollo/client";
import isEmpty from "lodash/fp/isEmpty";
import partition from "lodash/fp/partition";

import { importImages } from "./import-images";
import { importDatasets } from "./import-datasets";
import { DroppedFile, SetUploadStatuses } from "../../types";

export const importDroppedFiles = async ({
  files,
  workspaceId,
  datasetId,
  setFileUploadStatuses,
  apolloClient,
}: {
  files: DroppedFile[];
  workspaceId: string;
  datasetId: string;
  setFileUploadStatuses: SetUploadStatuses;
  apolloClient: ApolloClient<any>;
}) => {
  const acceptedFiles = files.filter((file) => isEmpty(file.errors));

  const [images, datasets] = partition(
    // Accepted files are either `images/*`, `application/json` or `application/zip`
    // The two last are treated as datasets
    (acceptedFile) => acceptedFile.file.type.startsWith("image"),
    acceptedFiles
  );

  await importImages({
    images,
    workspaceId,
    datasetId,
    apolloClient,
    setFileUploadStatuses,
  });

  await importDatasets({
    datasets,
    datasetId,
    workspaceId,
    apolloClient,
    setFileUploadStatuses,
  });
};
