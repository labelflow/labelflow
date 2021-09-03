import { ExportOptionsYolo, LabelType } from "@labelflow/graphql-types";
import JSZip from "jszip";
import mime from "mime-types";
import { DbImage, DbLabel, DbLabelClass } from "../../types";

import { ExportFunction } from "../types";

export const generateNamesFile = (labelClasses: DbLabelClass[]): string => {
  return labelClasses
    .reduce((namesFile, labelClass) => `${namesFile}${labelClass.name}\n`, "")
    .trim();
};

export const generateDataFile = (
  numberLabelClasses: number,
  datasetName: string
): string => {
  return `classes = ${numberLabelClasses}\ntrain = ${datasetName}/train.txt\ndata = ${datasetName}/obj.names`;
};

export const generateImagesListFile = (
  images: DbImage[],
  datasetName: string
): string => {
  return images
    .reduce(
      (imagesList, image) =>
        `${imagesList}${datasetName}/obj_train_data/${
          image.name
        }.${mime.extension(image.mimetype)}\n`,
      ""
    )
    .trim();
};

export const generateLabelsOfImageFile = (
  labelsOfImage: DbLabel[],
  image: DbImage,
  labelClasses: DbLabelClass[],
  options: ExportOptionsYolo
): string => {
  return labelsOfImage
    .reduce((labelsOfImageFile, label) => {
      if (!options?.includePolygons && label.type === LabelType.Polygon) {
        return `${labelsOfImageFile}`;
      }
      const labelClassIndex = labelClasses.find(
        (labelClass) => labelClass.id === label.labelClassId
      )?.index;
      return `${labelsOfImageFile}${labelClassIndex} ${label.x / image.width} ${
        label.y / image.height
      } ${label.width / image.width} ${label.height / image.width}\n`;
    }, "")
    .trim();
};

export const exportToYolo: ExportFunction = async (
  datasetId,
  options: ExportOptionsYolo = {},
  { repository }
) => {
  const images = await repository.image.list({ datasetId });
  const labelClasses = await repository.labelClass.list({ datasetId });
  const datasetName = options?.name ?? "dataset-yolo";
  const zip = new JSZip();
  zip.file(
    `${datasetName}/obj.data`,
    generateDataFile(labelClasses.length, datasetName)
  );
  zip.file(`${datasetName}/obj.names`, generateNamesFile(labelClasses));
  zip.file(
    `${datasetName}/train.txt`,
    generateImagesListFile(images, datasetName)
  );
  await Promise.all(
    images.map(async (image) => {
      if (options?.exportImages) {
        const blob = new Blob([await repository.upload.get(image.url)], {
          type: image.mimetype,
        });
        zip.file(
          `${datasetName}/obj_train_data/${image.name}.${mime.extension(
            image.mimetype
          )}`,
          blob
        );
      }
      const labelsOfImage = await repository.label.list({ imageId: image.id });
      zip.file(
        `${datasetName}/obj_train_data/${image.name}.txt`,
        generateLabelsOfImageFile(labelsOfImage, image, labelClasses, options)
      );
    })
  );
  const blobZip = await zip.generateAsync({ type: "blob" });
  return blobZip;
};
