import { QueryExportToCocoArgs } from "@labelflow/graphql-types";
import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { jsonToDataUri } from "./json-to-data-uri";
import { Context } from "../types";

import { addImageDimensionsToLabels } from "./add-image-dimensions-to-labels";

export const exportToCoco = async (
  _: any,
  args: QueryExportToCocoArgs,
  { repository }: Context
): Promise<string | undefined> => {
  const { datasetId } = args.where;
  const imagesWithUrl = await repository.image.list({ datasetId });
  const labelClasses = await repository.labelClass.list({ datasetId });
  const labels = await repository.label.list({ datasetId });

  const labelsWithImageDimensions = await addImageDimensionsToLabels(
    labels,
    repository
  );
  const json = JSON.stringify(
    convertLabelflowDatasetToCocoDataset(
      imagesWithUrl,
      labelsWithImageDimensions,
      labelClasses
    )
  );

  return jsonToDataUri(json);
};
