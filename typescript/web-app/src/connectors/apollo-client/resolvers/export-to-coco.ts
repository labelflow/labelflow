import {
  addImageToCocoDataset,
  convertLabelClassesToCocoCategories,
  initialCocoDataset,
} from "../../../data-converters/coco-format/converters";
import {
  CacheLabelClassIdToCocoCategoryId,
  CocoDataset,
} from "../../../data-converters/coco-format/types";
import { Label, LabelClass } from "../../../graphql-types.generated";
import { db } from "../../database";

const exportToCoco = async (): Promise<string | undefined> => {
  const labelClasses = await db.labelClass.orderBy("createdAt").toArray();
  const categories = convertLabelClassesToCocoCategories(
    labelClasses as LabelClass[]
  );

  const mapping: CacheLabelClassIdToCocoCategoryId = labelClasses.reduce(
    (previousMapping, currentLabelClass, index) => {
      previousMapping.set(currentLabelClass.id, index + 1);
      return previousMapping;
    },
    new Map()
  );
  const addImageToCocoDatasetWithMapping = addImageToCocoDataset(mapping);
  const images = await db.image.orderBy("createdAt").toArray();

  const initialDataset: CocoDataset = {
    ...initialCocoDataset,
    categories,
  };
  const cocoDataset: CocoDataset = await images.reduce(
    async (_previousCocoDataset, currentImage) => {
      const previousCocoDataset = await _previousCocoDataset;
      const labelsOfImage = await db.label
        .where({ imageId: currentImage.id })
        .sortBy("createdAt");
      const labelsOfImageWithLabelClasses = labelsOfImage.map((label) => ({
        ...label,
        labelClass: labelClasses.find(
          (labelClass) => labelClass.id === label.labelClassId
        ),
      }));
      return addImageToCocoDatasetWithMapping(previousCocoDataset, {
        ...currentImage,
        url: "", // No url should be persisted for now
        labels: labelsOfImageWithLabelClasses as Label[],
      });
    },
    new Promise((resolve) => resolve(initialDataset)) as Promise<CocoDataset>
  );
  return btoa(JSON.stringify(cocoDataset));
};

export default {
  Query: {
    exportToCoco,
  },
};
