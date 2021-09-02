import { ExportOptions } from "@labelflow/graphql-types";
import JSZip from "jszip";
import mime from "mime-types";

import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { jsonToDataUri } from "./json-to-data-uri";
import { ExportFunction } from "../types";

import { addImageDimensionsToLabels } from "./add-image-dimensions-to-labels";

export const exportToCoco: ExportFunction = async (
  datasetId,
  options: ExportOptions = {},
  { repository }
) => {
  const images = await repository.image.list({ datasetId });
  const labelClasses = await repository.labelClass.list({ datasetId });
  const labels = await repository.label.list({ datasetId });

  const labelsWithImageDimensions = await addImageDimensionsToLabels(
    labels,
    repository
  );
  const annotationsFileJson = JSON.stringify(
    convertLabelflowDatasetToCocoDataset(
      images,
      labelsWithImageDimensions,
      labelClasses
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
      images.map(
        async ({
          id,
          name,
          url,
          mimetype,
        }: {
          id: string;
          name: string;
          url: string;
          mimetype: string;
        }) => {
          const dataUrl = await (async (): Promise<string> => {
            const blob = await fetch(url).then((r) => r.blob());
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          })();
          zip.file(
            `${datasetName}/images/${name}_${id}.${mime.extension(mimetype)}`,
            dataUrl.substr(dataUrl.indexOf(",") + 1),
            {
              base64: true,
            }
          );
        }
      )
    );
    const blobZip = await zip.generateAsync({ type: "blob" });
    return blobZip;
  }
  return new Blob([annotationsFileJson], { type: "application/json" });
};
