import { QueryExportDatasetArgs, ExportFormat } from "@labelflow/graphql-types";
import { v4 as uuidv4 } from "uuid";

import { exportToYolo } from "./export-to-yolo";
import { exportToCoco } from "./format-coco";
import { Context } from "../types";
import { getOrigin } from "../utils/get-origin";
import { exportToCsv } from "./export-to-csv";

const generateExportFile = async (
  args: QueryExportDatasetArgs,
  context: Context
): Promise<Blob> => {
  switch (args.format) {
    case ExportFormat.Yolo: {
      return await exportToYolo(
        args.where.datasetId,
        args?.options?.yolo ?? {},
        context
      );
    }
    case ExportFormat.Coco: {
      return await exportToCoco(
        args.where.datasetId,
        args?.options?.coco ?? {},
        context
      );
    }
    case ExportFormat.Csv: {
      return await exportToCsv(
        args.where.datasetId,
        args?.options?.csv ?? {},
        context
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
  { repository, req, user }: Context
) => {
  const fileExport = await generateExportFile(args, { repository, req, user });
  const origin = getOrigin(req);
  const { uploadUrl, downloadUrl } =
    await repository.upload.getUploadTargetHttp(
      // FIXME make this Url disappear at some point...
      uuidv4(),
      origin
    );
  await repository.upload.put(uploadUrl, fileExport, req);
  return downloadUrl;
};

export default {
  Query: {
    exportDataset,
  },
};
