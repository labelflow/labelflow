import { ApolloClient, gql } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";
import {
  ExportDatasetUrlQuery,
  ExportDatasetUrlQueryVariables,
} from "../../../graphql-types/ExportDatasetUrlQuery";
import {
  ExportFormat,
  ExportOptions,
} from "../../../graphql-types/globalTypes";
import { getDatasetExportName, triggerClientDownload } from "../../../utils";

export const EXPORT_DATASET_URL_QUERY = gql`
  query ExportDatasetUrlQuery(
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

const getExtension = (format: ExportFormat, options: ExportOptions): string => {
  switch (format) {
    case ExportFormat.COCO: {
      const suffix = options.coco?.exportImages ? "zip" : "json";
      return `coco.${suffix}`;
    }
    case ExportFormat.YOLO: {
      return "yolo.zip";
    }
    case ExportFormat.CSV: {
      return "csv";
    }
    default: {
      throw new Error("Unsupported format");
    }
  }
};

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
  const datasetName = getDatasetExportName(datasetSlug);
  const {
    data: { exportDataset: exportDatasetUrl },
  } = await client.query<ExportDatasetUrlQuery, ExportDatasetUrlQueryVariables>(
    {
      query: EXPORT_DATASET_URL_QUERY,
      variables: {
        datasetId,
        format,
        options: {
          coco: { ...options.coco, name: datasetName },
          yolo: { ...options.yolo, name: datasetName },
          csv: { ...options.csv, name: datasetName },
        },
      },
    }
  );
  const blobDataset = await (await fetch(exportDatasetUrl)).blob();
  const extension = getExtension(format, options);
  triggerClientDownload(blobDataset, `${datasetName}.${extension}`);
  setIsExportRunning(false);
};
