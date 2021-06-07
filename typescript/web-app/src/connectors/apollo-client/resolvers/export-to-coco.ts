import { convertImagesAndLabelClassesToCocoDataset } from "../../../data-converters/coco-format/converters";
import { Image, Label, LabelClass } from "../../../graphql-types.generated";
import {
  getLabelsByImageId,
  getPaginatedImages,
  getUrlFromFileId,
} from "./image";
import { getPaginatedLabelClasses } from "./label-class";

const jsonToDataUri = (json: string): string =>
  `data:application/json;base64,${btoa(json)}`;

const exportToCoco = async (): Promise<string | undefined> => {
  const dbImages = await getPaginatedImages();

  const images: Image[] = await Promise.all(
    dbImages.map(
      async (image): Promise<Image> => ({
        ...image,
        labels: (
          await getLabelsByImageId(image.id)
        ).map(
          (dbLabel): Label => ({
            ...dbLabel,
            // TODO: Is it possible top avoid this without requesting the whole label
            // @ts-ignore
            labelClass: {
              id: dbLabel.labelClassId!,
            },
          })
        ),
        url: await getUrlFromFileId(image.fileId),
      })
    )
  );

  const labelClasses: LabelClass[] = (await getPaginatedLabelClasses()).map(
    (labelClass) => ({
      ...labelClass,
      labels: [],
    })
  );

  const json = JSON.stringify(
    convertImagesAndLabelClassesToCocoDataset(images, labelClasses)
  );

  return jsonToDataUri(json);
};

export default {
  Query: {
    exportToCoco,
  },
};
