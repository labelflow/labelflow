import JSZip from "jszip";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import type { UploadTargetHttp } from "@labelflow/graphql-types";

import { ImportFunction } from "../types";
import imageResolvers from "../../image";
import { CocoDataset } from "../../export/format-coco/coco-core/types";

const uploadImage = async (file, name, datasetId, { repository }) => {
  const fileBlob = await file.async("blob", () => {});
  const uploadTarget = await repository.upload.getUploadTarget(uuidv4());
  if (!(uploadTarget as UploadTargetHttp)?.downloadUrl) {
    throw new Error("Can't direct upload this image.");
  }
  repository.upload.put(
    (uploadTarget as UploadTargetHttp)?.downloadUrl,
    fileBlob
  );
  await imageResolvers.Mutation.createImage(
    null,
    {
      data: {
        url: (uploadTarget as UploadTargetHttp)?.downloadUrl,
        name,
        datasetId,
      },
    },
    { repository }
  );
  console.log("uploaded image ", name);
};

export const importCoco: ImportFunction = async (
  zipBlob,
  datasetId,
  { repository }
) => {
  const zip = await JSZip.loadAsync(zipBlob);
  const annotationsFilesJSZip = zip.filter(
    (relativePath) => path.extname(relativePath) === ".json"
  );
  if (annotationsFilesJSZip.length === 0) {
    throw new Error("No COCO annotation file was found in the zip file.");
  }
  if (annotationsFilesJSZip.length > 1) {
    throw new Error(
      "More than one COCO annotation file was found in the zip file."
    );
  }
  const annotationFile: CocoDataset = JSON.parse(
    await annotationsFilesJSZip[0].async("string", () => {})
  );
  //   console.log(JSON.stringify(annotationFile, null, 1));
  const imageFiles = zip.filter((relativePath) =>
    path.dirname(relativePath).endsWith("images")
  );
  const imageNameToFile = imageFiles.reduce(
    (imageNameToFileCurrent, imageFile) => {
      imageNameToFileCurrent.set(path.basename(imageFile.name), imageFile);
      return imageNameToFileCurrent;
    },
    new Map()
  );
  const { images } = annotationFile;
  // eslint-disable-next-line no-restricted-syntax
  for (const image of images) {
    const imageFile = imageNameToFile.get(image.file_name);
    // eslint-disable-next-line no-await-in-loop
    await uploadImage(imageFile, image.file_name, datasetId, { repository });
  }
};
