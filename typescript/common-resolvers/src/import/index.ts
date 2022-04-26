import {
  MutationImportDatasetArgs,
  ExportFormat,
  ImportStatus,
} from "@labelflow/graphql-types";

import { importCoco } from "./format-coco";
import { Context } from "../types";

const makeImport = async (
  args: MutationImportDatasetArgs,
  { repository, req, user }: Context
): Promise<ImportStatus> => {
  const datasetBlob = new Blob(
    [await repository.upload.get(args.data.url, req)],
    {
      type: "application/zip",
    }
  );
  await repository.upload.delete(args.data.url); // Remove blob from cache immediately
  // TODO: handle when args.where.slugs is used over args.where.id
  if (!args.where.id) {
    throw new Error(
      "Expecting args.where.id to be defined. Can't import from dataset slug."
    );
  }
  switch (args.data.format) {
    case ExportFormat.Yolo: {
      throw new Error("YOLO format not supported, but will be soon!");
    }
    case ExportFormat.Coco: {
      return await importCoco(
        datasetBlob,
        args.where?.id,
        {
          repository,
          req,
          user,
        },
        args.data?.options?.coco ?? undefined
      );
    }
    default: {
      throw new Error("Unsupported format");
    }
  }
};

const importDataset = async (
  _: any,
  args: MutationImportDatasetArgs,
  { repository, req, user }: Context
): Promise<ImportStatus> => {
  try {
    return await makeImport(args, { repository, req, user });
  } catch (e) {
    return {
      error: `${e.message}\n${e.stack}`,
      warnings: undefined,
    };
  }
};

export default {
  Mutation: {
    importDataset,
  },
};
