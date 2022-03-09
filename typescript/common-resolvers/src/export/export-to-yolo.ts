import { ExportOptionsYolo, LabelType } from "@labelflow/graphql-types";
import JSZip from "jszip";
import { groupBy, isEmpty } from "lodash/fp";
import mime from "mime-types";
import { Context, DbImage, DbLabel, DbLabelClass } from "../types";
import { getSignedImageUrl } from "../utils";
import { getImageName } from "./common";
import { ExportFunction } from "./types";

const groupLabelsByImage = (labelsArray: DbLabel[]) => {
  return isEmpty(labelsArray) ? {} : groupBy("imageId", labelsArray);
};

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

export const generateImagesListFile = async (
  images: DbImage[],
  datasetName: string,
  options: ExportOptionsYolo,
  includeSignedUrl: boolean,
  ctx: Context
): Promise<string> => {
  return (
    await Promise.all(
      images.map(async (image) => {
        const imagePath = `${datasetName}/obj_train_data/${getImageName(
          image,
          options?.avoidImageNameCollisions ?? false
        )}.${mime.extension(image.mimetype)}`;
        return includeSignedUrl
          ? [await getSignedImageUrl(image.url, ctx), imagePath].join(" ")
          : imagePath;
      })
    )
  ).join("\n");
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

export const exportToYolo: ExportFunction<ExportOptionsYolo> = async (
  datasetId,
  options = {},
  { repository, req, user }
) => {
  const [images, labelClasses, labels] = await Promise.all([
    repository.image.list({ datasetId, user }),
    repository.labelClass.list({ datasetId, user }),
    repository.label.list({ datasetId, user }),
  ]);
  const labelsByImage = groupLabelsByImage(labels);
  const datasetName = options?.name ?? "dataset-yolo";
  const zip = new JSZip();
  zip.file(
    `${datasetName}/obj.data`,
    generateDataFile(labelClasses.length, datasetName)
  );
  zip.file(`${datasetName}/obj.names`, generateNamesFile(labelClasses));
  zip.file(
    `${datasetName}/train.txt`,
    await generateImagesListFile(images, datasetName, options, false, {
      repository,
      req,
      user,
    })
  );
  if (!options?.exportImages) {
    zip.file(
      `${datasetName}/train_url.txt`,
      await generateImagesListFile(images, datasetName, options, true, {
        repository,
        req,
        user,
      })
    );
  }
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
      const labelsOfImage = labelsByImage[image.id] ?? [];
      const exportedLabels = generateLabelsOfImageFile(
        labelsOfImage,
        image,
        labelClasses,
        options
      );
      zip.file(
        `${datasetName}/obj_train_data/${imageName}.txt`,
        exportedLabels
      );
    })
  );
  const blobZip = new Blob([await zip.generateAsync({ type: "arraybuffer" })], {
    type: "application/zip",
  });
  return blobZip;
};
