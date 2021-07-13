import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { Image, QueryExportToCocoArgs } from "../../../graphql-types.generated";
import { getPaginatedImages } from "../image";
import { getPaginatedLabelClasses } from "../label-class";
import { getLabelsByProjectId } from "../project";
import { jsonToDataUri } from "./json-to-data-uri";

export const exportToCoco = async (
  _: any,
  args: QueryExportToCocoArgs
): Promise<string | undefined> => {
  const { projectId } = args.where;
  const imagesWithUrl = await Promise.all(
    (
      await getPaginatedImages({ projectId })
    ).map(
      async (image): Promise<Image> => ({
        ...image,
      })
    )
  );
  const labelClasses = await getPaginatedLabelClasses({ projectId });
  const labels = await getLabelsByProjectId(projectId);

  const json = JSON.stringify(
    convertLabelflowDatasetToCocoDataset(imagesWithUrl, labels, labelClasses)
  );

  return jsonToDataUri(json);
};
