import { convertLabelflowDatasetToCocoDataset } from "../../../data-converters/coco-format/converters";
import { Image } from "../../../graphql-types.generated";
import { getPaginatedImages, getUrlFromFileId } from "./image";
import { getLabels } from "./label";
import { LabelClassDataSource } from "../datasources/types";

export const jsonToDataUri = (json: string): string =>
  `data:application/json;base64,${btoa(json)}`;

const exportToCoco = async (
  _: any,
  _args: any,
  context: { dataSources: { labelClassDataSource: LabelClassDataSource } }
): Promise<string | undefined> => {
  const {
    dataSources: { labelClassDataSource },
  } = context;
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
  const labelClasses = await labelClassDataSource.getPaginatedLabelClasses();
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
