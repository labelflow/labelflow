import { convertLabelflowDatasetToCocoDataset } from "../../data-converters/coco-format/converters";
import { Image } from "../../graphql-types.generated";
import { getPaginatedImages, getUrlFromFileId } from "./image";
import { getPaginatedLabelClasses } from "./label-class";
import { getLabels } from "./label";

export const jsonToDataUri = (json: string): string =>
  `data:application/json;base64,${btoa(json)}`;

const exportToCoco = async (): Promise<string | undefined> => {
  const imagesWithUrl = await Promise.all(
    (
      await getPaginatedImages()
    ).map(
      async (image): Promise<Image> => ({
        ...image,
        url: await getUrlFromFileId(image.fileId),
      })
    )
  );
  const labelClasses = await getPaginatedLabelClasses();
  const labels = await getLabels();

  const json = JSON.stringify(
    convertLabelflowDatasetToCocoDataset(imagesWithUrl, labels, labelClasses)
  );

  return jsonToDataUri(json);
};

export default {
  Query: {
    exportToCoco,
  },
};
