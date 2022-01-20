import { ApolloClient, gql } from "@apollo/client";
import { ExportFormat, ExportOptions } from "@labelflow/graphql-types";
import { Dispatch, SetStateAction } from "react";

const EXPORT_QUERY = gql`
  query exportDatasetUrl(
    $datasetId: ID!
    $format: ExportFormat!
    $options: ExportOptions
  ) {
    exportDataset(
      where: { datasetId: $datasetId }
      format: $format
      options: $options
    )
  }
`;

export const exportDataset = async ({
  datasetId,
  datasetSlug,
  setIsExportRunning,
  client,
  format,
  options,
}: {
  datasetId: string;
  datasetSlug: string;
  setIsExportRunning: Dispatch<SetStateAction<boolean>>;
  client: ApolloClient<Object>;
  format: ExportFormat;
  options: ExportOptions;
}) => {
  setIsExportRunning(true);
  const dateObject = new Date();
  const date = `${dateObject
    .toLocaleDateString()
    .split("/")
    .reverse()
    .join("-")}T${String(dateObject.getHours()).padStart(2, "0")}${String(
    dateObject.getMinutes()
  ).padStart(2, "0")}${String(dateObject.getSeconds()).padStart(2, "0")}`;
  const datasetName = `${datasetSlug}-${format.toLowerCase()}-${date}`;
  const {
    data: { exportDataset: exportDatasetUrl },
  } = await client.query({
    query: EXPORT_QUERY,
    variables: {
      datasetId,
      format,
      options: {
        coco: { ...options.coco, name: datasetName },
        yolo: { ...options.yolo, name: datasetName },
      },
    },
  });
  const blobDataset = await (await fetch(exportDatasetUrl)).blob();
  const url = window.URL.createObjectURL(blobDataset);
  const element = document.createElement("a");
  const extension =
    format === ExportFormat.Yolo || options.coco?.exportImages ? "zip" : "json";
  element.href = url;
  element.download = `${datasetName}.${extension}`;
  setIsExportRunning(false);
  element.click();
};
