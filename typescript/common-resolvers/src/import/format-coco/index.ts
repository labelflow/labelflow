import JSZip from "jszip";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import type {
  UploadTargetHttp,
  GeometryInput,
  LabelType,
} from "@labelflow/graphql-types";
import { LabelType as LabelTypeOptions } from "@labelflow/graphql-types";

import { range } from "lodash/fp";
import { ImportFunction } from "../types";
import imageResolvers from "../../image";
import labelClassResolvers from "../../label-class";
import labelResolvers from "../../label";
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

const isCocoSegmentationBox = (cocoSegmentation: number[][]): boolean => {
  if (cocoSegmentation.length === 0) {
    throw new Error("received segmentation without any items inside.");
  }
  if (cocoSegmentation.length > 1 || cocoSegmentation[0].length !== 10) {
    return false;
  }
  const maybeBox = cocoSegmentation[0].map(Math.floor);
  const { x: xValues, y: yValues } = maybeBox.reduce(
    ({ x, y }, value, index) => {
      if (index % 2 === 0) {
        x.add(value);
      } else {
        y.add(value);
      }
      return { x, y };
    },
    { x: new Set(), y: new Set() }
  );
  return xValues.size === 2 && yValues.size === 2;
};

const convertCocoSegmentationToLabel = (
  cocoSegmentation: number[][],
  imageHeight: number
): { geometry: GeometryInput; type: LabelType } => ({
  type: isCocoSegmentationBox(cocoSegmentation)
    ? LabelTypeOptions.Box
    : LabelTypeOptions.Polygon,
  geometry: {
    type: "Polygon",
    coordinates: cocoSegmentation.map((cocoPolygon) =>
      range(0, cocoPolygon.length / 2).map((index) => [
        cocoPolygon[2 * index],
        imageHeight - cocoPolygon[2 * index + 1],
      ])
    ),
  },
});

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
  const cocoImageIdToLabelFlowImageId = new Map<number, string>();
  const images = await repository.image.list({ datasetId });
  const imagesCoco = annotationFile.images.filter((imageCoco) => {
    const labelFlowImage = images.find(
      (image) =>
        image.name ===
        imageCoco.file_name.replace(path.extname(imageCoco.file_name), "")
    );
    if (labelFlowImage) {
      cocoImageIdToLabelFlowImageId.set(imageCoco.id, labelFlowImage.id);
      return false;
    }
    return true;
  });
  // eslint-disable-next-line no-restricted-syntax
  for (const imageCoco of imagesCoco) {
    const imageFile = imageNameToFile.get(imageCoco.file_name);
    // eslint-disable-next-line no-await-in-loop
    const {
      id: labelFlowImageId,
      // eslint-disable-next-line no-await-in-loop
    } = await uploadImage(imageFile, imageCoco.file_name, datasetId, {
      repository,
    });
    cocoImageIdToLabelFlowImageId.set(imageCoco.id, labelFlowImageId);
    console.log(`Created image ${imageCoco.file_name}`);
  }
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
          data: { name: categoryCoco.name, datasetId, color: 0xbbbbbb }, // TODO: manage labelClass colors
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
  await annotationFile.annotations.map(async (annotation) => {
    await labelResolvers.Mutation.createLabel(
      null,
      {
        data: {
          imageId: cocoImageIdToLabelFlowImageId.get(annotation.image_id),
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
  });
};
