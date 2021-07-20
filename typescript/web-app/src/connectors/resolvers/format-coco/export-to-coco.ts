import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { Image, QueryExportToCocoArgs } from "../../../graphql-types.generated";
import { getPaginatedLabelClasses } from "../label-class";
import { getLabelsByProjectId } from "../project";
import { jsonToDataUri } from "./json-to-data-uri";
import { Repository } from "../../repository";

export const exportToCoco = async (
  _: any,
  args: QueryExportToCocoArgs,
  { repository }: { repository: Repository }
): Promise<string | undefined> => {
  const { projectId } = args.where;
  const imagesWithUrl: Image[] = await repository.image.list({ projectId });
  const labelClasses = await getPaginatedLabelClasses({ projectId });
  const labels = await getLabelsByProjectId(projectId);

  const json = JSON.stringify(
    convertLabelflowDatasetToCocoDataset(imagesWithUrl, labels, labelClasses)
  );

  return jsonToDataUri(json);
};
