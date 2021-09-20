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
): Promise<Blob> => {
  const zipBlob: Blob = new Blob([await repository.upload.get(args.url)]);
  switch (args.format) {
    case ExportFormat.Yolo: {
      throw new Error("YOLO format not supported, but will be soon!");
    }
    case ExportFormat.Coco: {
      return importCoco(zipBlob, {
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
      error: e.message,
    };
  }
};

export default {
  Mutation: {
    importDataset,
  },
};
