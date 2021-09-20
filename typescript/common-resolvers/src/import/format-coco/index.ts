import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";

import type { UploadTargetHttp } from "@labelflow/graphql-types";

import { ImportFunction } from "../types";

export const importCoco: ImportFunction = async (zipBlob, { repository }) => {
  const zip = await JSZip.loadAsync(zipBlob);
  const annotationsFilePath = "";
  zip.forEach(async (relativePath, file) => {
    const fileBlob = await file.async("blob", () => {});
    if (relativePath.split("/").includes("images")) {
      const uploadTarget = await repository.upload.getUploadTarget(uuidv4());
      if (!(uploadTarget as UploadTargetHttp)?.downloadUrl) {
        throw new Error("Can't direct upload this image.");
      }
      repository.upload.put(
        (uploadTarget as UploadTargetHttp)?.downloadUrl,
        fileBlob
      );
      console.log("uploaded image ", relativePath);
    } else {
      const pathSplitExtension = relativePath.split(".");
      if (!(pathSplitExtension[pathSplitExtension.length - 1] === "json")) {
        throw new Error(`Received an unknown file: ${relativePath}`);
      }
      if (annotationsFilePath) {
        throw new Error(
          `Already received an annotation file ${annotationsFilePath} and found another json file named ${relativePath}`
        );
      }
      // Supposed to implement the import of that file now
    }
  });
  // Do sthg
};
