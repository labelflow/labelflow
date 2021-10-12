import JSZip from "jszip";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import type { UploadTargetHttp } from "@labelflow/graphql-types";

import { ImportFunction } from "../types";
import imageResolvers from "../../image";
import labelClassResolvers from "../../label-class";
import labelResolvers from "../../label";
import { CocoDataset } from "../../export/format-coco/coco-core/types";
import { Context } from "../../types";
import { convertCocoSegmentationToLabel } from "./converters";
import { getOrigin } from "../../utils/get-origin";

const uploadImage = async (
  file: JSZip.JSZipObject,
  name: string,
  datasetId: string,
  { repository, req }: Context
) => {
  const fileBlob = await file.async("blob", () => {});
  const origin = getOrigin(req);
  const uploadTarget = await repository.upload.getUploadTarget(
    uuidv4(),
    origin
  );
  if (!(uploadTarget as UploadTargetHttp)?.downloadUrl) {
    throw new Error("Can't direct upload this image.");
  }
  repository.upload.put(
    (uploadTarget as UploadTargetHttp)?.downloadUrl,
    fileBlob
  );
  return await imageResolvers.Mutation.createImage(
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
};

export const importCoco: ImportFunction = async (
  blob,
  datasetId,
  { repository },
  options
) => {
  let annotationBlob = blob;
  if (!options?.annotationsOnly) {
    const zip = await JSZip.loadAsync(blob);
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
    annotationBlob = await annotationsFilesJSZip[0].async("blob", () => {});
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
    // Manage coco images => labelflow images
    const images = await repository.image.list({ datasetId });
    const imagesCoco = annotationFile.images.filter(
      (imageCoco) =>
        !images.find(
          (image) =>
            image.name ===
            imageCoco.file_name.replace(path.extname(imageCoco.file_name), "")
        )
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const imageCoco of imagesCoco) {
      const imageFile = imageNameToFile.get(imageCoco.file_name);
      // eslint-disable-next-line no-await-in-loop
      await uploadImage(imageFile, imageCoco.file_name, datasetId, {
        repository,
      });
      // cocoImageIdToLabelFlowImageId.set(imageCoco.id, labelFlowImageId);
      console.log(`Created image ${imageCoco.file_name}`);
    }
  }
  const annotationFile: CocoDataset = JSON.parse(await annotationBlob.text());
  const images = await repository.image.list({ datasetId });
  const cocoImageIdToLabelFlowImageId = annotationFile.images.reduce(
    (currentMap, imageCoco) => {
      const labelFlowImage = images.find(
        (image) =>
          image.name ===
          imageCoco.file_name.replace(path.extname(imageCoco.file_name), "")
      );
      if (labelFlowImage) {
        currentMap.set(imageCoco.id, labelFlowImage.id);
      }
      return currentMap;
    },
    new Map<number, string>()
  );
  // Manage coco categories => labelflow labelclasses
  const cocoCategoryIdToLabelFlowLabelClassId = new Map<number, string>();
  const labelClasses = await repository.labelClass.list({ datasetId });
  const categoriesCoco = annotationFile.categories.filter((categoryCoco) => {
    const labelFlowLabelClass = labelClasses.find(
      (labelClass) => labelClass.name === categoryCoco.name
    );
    if (labelFlowLabelClass) {
      cocoCategoryIdToLabelFlowLabelClassId.set(
        categoryCoco.id,
        labelFlowLabelClass.id
      );
      return false;
    }
    return true;
  });
  // eslint-disable-next-line no-restricted-syntax
  for (const categoryCoco of categoriesCoco) {
    const { id: labelFlowLabelClassId } =
      // eslint-disable-next-line no-await-in-loop
      await labelClassResolvers.Mutation.createLabelClass(
        null,
        {
          data: { name: categoryCoco.name, datasetId },
        },
        { repository }
      );
    cocoCategoryIdToLabelFlowLabelClassId.set(
      categoryCoco.id,
      labelFlowLabelClassId
    );
    console.log(`Created category ${categoryCoco.name}`);
  }
  // Manage coco annotations => labelflow labels
  await Promise.all(
    annotationFile.annotations.map(async (annotation) => {
      if (!cocoImageIdToLabelFlowImageId.has(annotation.image_id)) {
        throw new Error(
          `Image ${annotation.image_id} referenced in annotation does not exist.`
        );
      }
      await labelResolvers.Mutation.createLabel(
        null,
        {
          data: {
            imageId: cocoImageIdToLabelFlowImageId.get(
              annotation.image_id
            ) as string,
            labelClassId: cocoCategoryIdToLabelFlowLabelClassId.get(
              annotation.category_id
            ),
            ...convertCocoSegmentationToLabel(
              annotation.segmentation,
              annotationFile.images[annotation.image_id - 1].height
            ),
          },
        },
        { repository }
      );
      console.log(`Created annotation ${annotation.id}`);
    })
  );
};
