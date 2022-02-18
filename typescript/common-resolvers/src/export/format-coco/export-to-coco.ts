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
  const images = await repository.image.list({ datasetId, user });
  const labelClasses = await repository.labelClass.list({ datasetId, user });
  const labels = await repository.label.list({ datasetId, user });

  const labelsWithImageDimensions = addImageDimensionsToLabels(labels, images);
  const annotationsFileJson = JSON.stringify(
    convertLabelflowDatasetToCocoDataset(
      images,
      labelsWithImageDimensions,
      labelClasses,
      options
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
