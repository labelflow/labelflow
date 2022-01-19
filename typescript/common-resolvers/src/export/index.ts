import { QueryExportDatasetArgs, ExportFormat } from "@labelflow/graphql-types";
import { v4 as uuidv4 } from "uuid";

import { exportToCoco } from "./format-coco/index";
import { exportToYolo } from "./format-yolo/index";
import { Context } from "../types";
import { getOrigin } from "../utils/get-origin";

const generateExportFile = async (
  args: QueryExportDatasetArgs,
  context: Context,
  user?: { id: string }
): Promise<Blob> => {
  switch (args.format) {
    case ExportFormat.Yolo: {
      return await exportToYolo(
        args.where.datasetId,
        args?.options?.yolo ?? {},
        context,
        user
      );
    }
    case ExportFormat.Coco: {
      return await exportToCoco(
        args.where.datasetId,
        args?.options?.coco ?? {},
        context,
        user
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
  const fileExport = await generateExportFile(args, { repository, req }, user);
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
