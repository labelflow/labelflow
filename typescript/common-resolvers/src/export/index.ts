import { QueryExportDatasetArgs, ExportFormat } from "@labelflow/graphql-types";

import { exportToCoco } from "./format-coco/index";
import { exportToYolo } from "./format-yolo/index";
import { Context } from "../types";

const generateExportFile = async (
  args: QueryExportDatasetArgs,
  { repository }: Context
): Promise<Blob> => {
  switch (args.format) {
    case ExportFormat.Yolo: {
      return await exportToYolo(args.where.datasetId, args?.options?.yolo, {
        repository,
      });
    }
    case ExportFormat.Coco: {
      return await exportToCoco(args.where.datasetId, args?.options?.coco, {
        repository,
      });
    }
    default: {
      throw new Error("Unsupported format");
    }
  }
};

const exportDataset = async (
  _: any,
  args: QueryExportDatasetArgs,
  { repository }: Context
) => {
  const fileExport = await generateExportFile(args, { repository });
  const outUrl = (await repository.upload.getUploadTargetHttp())?.uploadUrl;
  await repository.upload.put(outUrl, fileExport);
  return outUrl;
};

export default {
  Query: {
    exportDataset,
  },
};
