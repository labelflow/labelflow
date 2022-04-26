import { ExportOptionsCoco } from "@labelflow/graphql-types";
import JSZip from "jszip";
import mime from "mime-types";
import { getImageName } from "../common";
import { ExportFunction } from "../types";
import { addImageDimensionsToLabels } from "./add-image-dimensions-to-labels";
import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { jsonToDataUri } from "./json-to-data-uri";

export const exportToCoco: ExportFunction<ExportOptionsCoco> = async (
  datasetId,
  options = {},
  { repository, req, user }
) => {
  const [images, labelClasses, labels] = await Promise.all([
    repository.image.list({ datasetId, user }),
    repository.labelClass.list({ datasetId, user }),
    repository.label.list({ datasetId, user }),
  ]);

  const labelsWithImageDimensions = addImageDimensionsToLabels(labels, images);
  const annotationsFileJson = JSON.stringify(
    await convertLabelflowDatasetToCocoDataset(
      images,
      labelsWithImageDimensions,
      labelClasses,
      options,
      { repository, req, user }
    )
  );
  const annotationsFileDataUri = jsonToDataUri(annotationsFileJson);
  const datasetName = options?.name ?? "dataset-coco";
  if (options?.exportImages) {
    const zip = new JSZip();
    zip.file(
      `${datasetName}/annotations.json`,
      annotationsFileDataUri.substr(annotationsFileDataUri.indexOf(",") + 1),
      {
        base64: true,
      }
    );
    await Promise.all(
      images.map(async (image) => {
        const arrayBufferImage = await repository.upload.get(image.url, req);
        zip.file(
          `${datasetName}/images/${getImageName(
            image,
            options?.avoidImageNameCollisions ?? false
          )}.${mime.extension(image.mimetype)}`,
          arrayBufferImage
        );
      })
    );
    const blobZip = new Blob(
      [await zip.generateAsync({ type: "arraybuffer" })],
      {
        type: "application/zip",
      }
    );
    return blobZip;
  }
  return new Blob([annotationsFileJson], { type: "application/json" });
};
