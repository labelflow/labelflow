import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { QueryExportToCocoArgs } from "../../../graphql-types.generated";
import { jsonToDataUri } from "./json-to-data-uri";
import { Repository } from "../../repository/types";

export const exportToCoco = async (
  _: any,
  args: QueryExportToCocoArgs,
  { repository }: { repository: Repository }
): Promise<string | undefined> => {
  const { projectId } = args.where;
  const imagesWithUrl = await repository.image.list({ projectId });
  const labelClasses = await repository.labelClass.list({ projectId });
  const labels = await repository.label.list({ projectId });

  const json = JSON.stringify(
    convertLabelflowDatasetToCocoDataset(imagesWithUrl, labels, labelClasses)
  );

  return jsonToDataUri(json);
};
