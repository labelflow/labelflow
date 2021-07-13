import { convertLabelflowDatasetToCocoDataset } from "./coco-core/converters";
import { Image } from "../../../graphql-types.generated";
import { getPaginatedImages } from "../image";
import { getPaginatedLabelClasses } from "../label-class";
import { getLabels } from "../label";
import { jsonToDataUri } from "./json-to-data-uri";

export const exportToCoco = async (): Promise<string | undefined> => {
  const imagesWithUrl: Image[] = await getPaginatedImages();
  const labelClasses = await getPaginatedLabelClasses();
  const labels = await getLabels();

  const json = JSON.stringify(
    convertLabelflowDatasetToCocoDataset(imagesWithUrl, labels, labelClasses)
  );

  return jsonToDataUri(json);
};
