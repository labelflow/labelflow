import { Image } from "../../../../graphql-types.generated";
import { DbLabel, DbLabelClass } from "../../../database";
import {
  CocoCategory,
  CocoAnnotation,
  CocoImage,
  CocoDataset,
  DbLabelWithImageDimensions,
} from "./types";

export {
  initialCocoDataset,
  convertLabelClassToCocoCategory,
  convertLabelClassesToCocoCategories,
  convertLabelToCocoAnnotation,
  convertLabelsOfImageToCocoAnnotations,
  convertImageToCocoImage,
  convertImagesToCocoImages,
  convertLabelflowDatasetToCocoDataset,
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
  labelClass: DbLabelClass,
  id: number
): CocoCategory => {
  return {
    id,
    name: labelClass.name,
    supercategory: "",
  };
};

const convertLabelClassesToCocoCategories = (labelClasses: DbLabelClass[]) => {
  const labelClassIdsMap: Record<string, number> = {};

  const cocoCategories = labelClasses.map((labelClass, index) => {
    const cocoCategoryId = index + 1;
    labelClassIdsMap[labelClass.id] = cocoCategoryId;
    return convertLabelClassToCocoCategory(labelClass, cocoCategoryId);
  });

  return {
    cocoCategories,
    labelClassIdsMap,
  };
};

const convertLabelToCocoAnnotation = (
  // @ts-ignore
  {
    x,
    y,
    width,
    height,
    geometry,
    imageDimensions,
  }: DbLabelWithImageDimensions,
  id: number,
  imageId: number,
  categoryId: number | null = null
): CocoAnnotation => {
  return {
    id,
    image_id: imageId,
    category_id: categoryId,
    segmentation: geometry.coordinates.map(
      (polygon: [number, number][]): number[] =>
        polygon?.reduce(
          (polygonCoordinates: number[], coordinates) => [
            ...polygonCoordinates,
            coordinates[0],
            imageDimensions.height - coordinates[1],
          ],
          []
        )
    ),
    area: width * height,
    bbox: [x, imageDimensions.height - y - height, width, height],
    iscrowd: 0,
  };
};

const convertLabelsOfImageToCocoAnnotations = (
  labels: DbLabelWithImageDimensions[],
  imageIdsMap: Record<string, number>,
  labelClassIdsMap: Record<string, number>
) => {
  return labels.map((label, index) => {
    const cocoAnnotationId = index + 1;
    return convertLabelToCocoAnnotation(
      label,
      cocoAnnotationId,
      imageIdsMap[label.imageId],
      label.labelClassId ? labelClassIdsMap[label.labelClassId] : null
    );
  });
};

const convertImageToCocoImage = (
  { createdAt, height, width, name, externalUrl }: Image,
  id: number
): CocoImage => {
  return {
    id,
    file_name: name,
    coco_url: externalUrl ?? "",
    date_captured: createdAt,
    flickr_url: "",
    height,
    width,
    license: 0,
  };
};

const convertImagesToCocoImages = (images: Image[]) => {
  const imageIdsMap: Record<string, number> = {};
  const cocoImages = images.map((image, index) => {
    const cocoImageId = index + 1;
    imageIdsMap[image.id] = cocoImageId;
    return convertImageToCocoImage(image, cocoImageId);
  });

  return { cocoImages, imageIdsMap };
};

const convertLabelflowDatasetToCocoDataset = (
  images: Image[],
  labels: DbLabelWithImageDimensions[],
  labelClasses: DbLabelClass[]
): CocoDataset => {
  const { cocoImages, imageIdsMap } = convertImagesToCocoImages(images);

  const { cocoCategories, labelClassIdsMap } =
    convertLabelClassesToCocoCategories(labelClasses);

  const cocoAnnotations = convertLabelsOfImageToCocoAnnotations(
    labels,
    imageIdsMap,
    labelClassIdsMap
  );

  return {
    ...initialCocoDataset,
    categories: cocoCategories,
    images: cocoImages,
    annotations: cocoAnnotations,
  };
};
