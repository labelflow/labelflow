import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { jsonToDataUri } from "./json-to-data-uri";
import { QueryExportToCocoArgs } from "../../../graphql-types.generated";
import { Repository } from "../../repository/types";
import { addImageDimensionsToLabels } from "../project";

export const exportToCoco = async (
  _: any,
  args: QueryExportToCocoArgs,
  { repository }: { repository: Repository }
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
