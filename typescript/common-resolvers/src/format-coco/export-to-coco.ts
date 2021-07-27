import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { QueryExportToCocoArgs } from "@labelflow/graphql-types";
import { jsonToDataUri } from "./json-to-data-uri";
import { Context } from "../types";

import { addImageDimensionsToLabels } from "./add-image-dimensions-to-labels";

export const exportToCoco = async (
  _: any,
  args: QueryExportToCocoArgs,
  { repository }: Context
): Promise<string | undefined> => {
  const { projectId } = args.where;
  const imagesWithUrl = await repository.image.list({ projectId });
  const labelClasses = await repository.labelClass.list({ projectId });
  const labels = await repository.label.list({ projectId });

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
