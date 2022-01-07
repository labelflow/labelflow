import { ExportOptionsYolo, LabelType } from "@labelflow/graphql-types";
import JSZip from "jszip";
import mime from "mime-types";
import { DbImage, DbLabel, DbLabelClass } from "../../types";
import { getImageName } from "../common";

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
  datasetName: string,
  options: ExportOptionsYolo
): string => {
  return images
    .reduce(
      (imagesList, image) =>
        `${imagesList}${datasetName}/obj_train_data/${getImageName(
          image,
          options?.avoidImageNameCollisions ?? false
        )}.${mime.extension(image.mimetype)}\n`,
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
      if (
        (!options?.includePolygons && label.type === LabelType.Polygon) ||
        !label.labelClassId
      ) {
        return labelsOfImageFile;
      }
      const labelClassIndex = labelClasses.find(
        (labelClass) => labelClass.id === label.labelClassId
      )?.index;
      return `${labelsOfImageFile}${labelClassIndex} ${label.x / image.width} ${
        label.y / image.height
      } ${label.width / image.width} ${label.height / image.height}\n`;
    }, "")
    .trim();
};

export const exportToYolo: ExportFunction = async (
  datasetId,
  options: ExportOptionsYolo = {},
  { repository, req },
  user
) => {
  const images = await repository.image.list({ datasetId, user });
  const labelClasses = await repository.labelClass.list({ datasetId, user });
  const datasetName = options?.name ?? "dataset-yolo";
  const zip = new JSZip();
  zip.file(
    `${datasetName}/obj.data`,
    generateDataFile(labelClasses.length, datasetName)
  );
  zip.file(`${datasetName}/obj.names`, generateNamesFile(labelClasses));
  zip.file(
    `${datasetName}/train.txt`,
    generateImagesListFile(images, datasetName, options)
  );
  await Promise.all(
    images.map(async (image) => {
      const imageName = getImageName(
        image,
        options?.avoidImageNameCollisions ?? false
      );
      if (options?.exportImages) {
        const arrayBufferImage = await repository.upload.get(image.url, req);
        zip.file(
          `${datasetName}/obj_train_data/${imageName}.${mime.extension(
            image.mimetype
          )}`,
          arrayBufferImage
        );
      }
      const labelsOfImage = await repository.label.list({
        imageId: image.id,
        user,
      });
      zip.file(
        `${datasetName}/obj_train_data/${imageName}.txt`,
        generateLabelsOfImageFile(labelsOfImage, image, labelClasses, options)
      );
    })
  );
  const blobZip = new Blob([await zip.generateAsync({ type: "arraybuffer" })], {
    type: "application/zip",
  });
  return blobZip;
};
