import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { Image, QueryExportToCocoArgs } from "../../../graphql-types.generated";
import { getPaginatedImages } from "../image";
import { getPaginatedLabelClasses } from "../label-class";
import { getLabelsWithImageDimensionsByProjectId } from "../project";
import { jsonToDataUri } from "./json-to-data-uri";

export const exportToCoco = async (
  _: any,
  args: QueryExportToCocoArgs
): Promise<string | undefined> => {
  const { projectId } = args.where;
  const imagesWithUrl: Image[] = await getPaginatedImages({ projectId });
  const labelClasses = await getPaginatedLabelClasses({ projectId });
  const labels = await getLabelsWithImageDimensionsByProjectId(projectId);

  const json = JSON.stringify(
    convertLabelflowDatasetToCocoDataset(imagesWithUrl, labels, labelClasses)
  );

  return jsonToDataUri(json);
};
