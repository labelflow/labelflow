import { Label, LabelClass, Image } from "../../types.generated";
import {
  CocoCategory,
  CocoAnnotation,
  CacheLabelClassIdToCocoCategoryId,
  CocoImage,
  CocoDataset,
} from "./types";

export {
  initialCocoDataset,
  convertLabelClassToCocoCategory,
  convertLabelClassesToCocoCategories,
  convertLabelToCocoAnnotation,
  convertLabelsOfImageToCocoAnnotations,
  convertImageToCocoImage,
  addImageToCocoDataset,
  convertImagesAndLabelClassesToCocoDataset,
};

const initialCocoDataset: CocoDataset = {
  info: {
    contributor: "",
    date_created: "",
    description: "",
    url: "",
    version: "",
    year: "",
  },
  licenses: [
    {
      name: "",
      id: 0,
      url: "",
    },
  ],
  annotations: [],
  categories: [],
  images: [],
};

const convertLabelClassToCocoCategory = (
  labelClass: LabelClass,
  id: number
): CocoCategory => {
  return {
    id,
    name: labelClass.name,
    supercategory: "",
  };
};

const convertLabelClassesToCocoCategories = (
  labelClasses: LabelClass[]
): CocoCategory[] => {
  return labelClasses.map((value, index) =>
    convertLabelClassToCocoCategory(value, index + 1)
  );
};

const convertLabelToCocoAnnotation = (
  { x, y, width, height }: Label,
  id: number,
  imageId: number,
  categoryId: number | null = null
): CocoAnnotation => {
  return {
    id,
    image_id: imageId,
    category_id: categoryId,
    segmentation: [],
    area: width * height,
    bbox: [x, y, width, height],
    iscrowd: 0,
  };
};

const convertLabelsOfImageToCocoAnnotations = (
  labels: Label[],
  imageId: number,
  mapping: CacheLabelClassIdToCocoCategoryId,
  idOffset: number = 1
): CocoAnnotation[] => {
  return labels.map((label, index) =>
    convertLabelToCocoAnnotation(
      label,
      idOffset + index,
      imageId,
      mapping.get(label?.labelClass?.id)
    )
  );
};

const convertImageToCocoImage = (
  { createdAt, height, width, url, name }: Image,
  id: number
): CocoImage => {
  return {
    id,
    file_name: name,
    coco_url: url,
    date_captured: createdAt,
    flickr_url: "",
    height,
    width,
    license: 0,
  };
};

const addImageToCocoDataset =
  (mapping: CacheLabelClassIdToCocoCategoryId) =>
  (cocoDataset: CocoDataset, image: Image): CocoDataset => {
    const imageId: number = cocoDataset.images.length + 1;
    const imageCoco: CocoImage = convertImageToCocoImage(image, imageId);
    const annotationsCoco: CocoAnnotation[] =
      convertLabelsOfImageToCocoAnnotations(
        image.labels,
        imageId,
        mapping,
        cocoDataset.annotations.length + 1
      );
    return {
      ...cocoDataset,
      images: [...cocoDataset.images, imageCoco],
      annotations: [...cocoDataset.annotations, ...annotationsCoco],
    };
  };

const convertImagesAndLabelClassesToCocoDataset = (
  images: Image[],
  labelClasses: LabelClass[]
): CocoDataset => {
  const categories = convertLabelClassesToCocoCategories(labelClasses);

  const mapping: CacheLabelClassIdToCocoCategoryId = labelClasses.reduce(
    (previousMapping, currentLabelClass, index) => {
      previousMapping.set(currentLabelClass.id, index + 1);
      return previousMapping;
    },
    new Map()
  );

  const initialDataset: CocoDataset = {
    ...initialCocoDataset,
    categories,
  };
  const addImageToCocoDatasetWithMapping = addImageToCocoDataset(mapping);

  return images.reduce(addImageToCocoDatasetWithMapping, initialDataset);
};
