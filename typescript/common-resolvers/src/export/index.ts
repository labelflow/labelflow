import { QueryExportDatasetArgs, ExportFormat } from "@labelflow/graphql-types";
import { v4 as uuidv4 } from "uuid";

import { exportToCoco } from "./format-coco/index";
import { exportToYolo } from "./format-yolo/index";
import { Context } from "../types";

const generateExportFile = async (
  args: QueryExportDatasetArgs,
  { repository }: Context
): Promise<Blob> => {
  switch (args.format) {
    case ExportFormat.Yolo: {
      return await exportToYolo(
        args.where.datasetId,
        args?.options?.yolo ?? {},
        {
          repository,
        }
      );
    }
    case ExportFormat.Coco: {
      return await exportToCoco(
        args.where.datasetId,
        args?.options?.coco ?? {},
        {
          repository,
        }
      );
    }
    default: {
      throw new Error("Unsupported format");
    }
  }
};

const exportDataset = async (
  _: any,
  args: QueryExportDatasetArgs,
  { repository, req }: Context
) => {
  const fileExport = await generateExportFile(args, { repository });
  const origin = (req?.headers as any)?.origin ?? req?.headers?.get?.("origin");
  const outUrl = (
    await repository.upload.getUploadTargetHttp(
      // FIXME make this Url disappear at some point...
      uuidv4(),
      origin
    )
  )?.uploadUrl;
  await repository.upload.put(outUrl, fileExport);
  return outUrl;
};

export default {
  Query: {
    exportDataset,
  },
};
