import {
  MutationImportDatasetArgs,
  ExportFormat,
  ImportStatus,
} from "@labelflow/graphql-types";

import { importCoco } from "./format-coco";
import { Context } from "../types";

const makeImport = async (
  args: MutationImportDatasetArgs,
  { repository }: Context
): Promise<void> => {
  const zipBlob: Blob = new Blob([await repository.upload.get(args.data.url)]);
  // TODO: handle when args.where.slugs is used over args.where.id
  switch (args.data.format) {
    case ExportFormat.Yolo: {
      throw new Error("YOLO format not supported, but will be soon!");
    }
    case ExportFormat.Coco: {
      return importCoco(zipBlob, args.where.id, args.data?.options?.coco, {
        repository,
      });
    }
    default: {
      throw new Error("Unsupported format");
    }
  }
};

const importDataset = async (
  _: any,
  args: MutationImportDatasetArgs,
  { repository }: Context
): Promise<ImportStatus> => {
  try {
    await makeImport(args, { repository });
    return {};
  } catch (e) {
    return {
      error: `${e.message}\n${e.stack}`,
    };
  }
};

export default {
  Mutation: {
    importDataset,
  },
};
