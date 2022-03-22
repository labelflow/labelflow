import { ExportOptionsCoco } from "@labelflow/graphql-types";
import { Geometry } from "@turf/helpers";
import { coordReduce } from "@turf/meta";
import mime from "mime-types";
import { Context, DbImage, DbLabelClass } from "../../../types";
import { getSignedImageUrl } from "../../../utils";
import { getImageName } from "../../common";
import {
  CocoAnnotation,
  CocoCategory,
  CocoDataset,
  CocoImage,
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
  convertGeometryToSegmentation,
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

const convertGeometryToSegmentation = (
  geometry: Geometry,
  imageHeight: number
): number[][] => {
  return coordReduce(
    geometry,
    (
      segmentation: number[][],
      [x, y]: number[],
      _coordIndex: number,
      _featureIndex: number,
      multiFeatureIndex: number,
      geometryIndex: number
    ) => {
      // Only take the outer ring of the geometry
      if (geometryIndex > 0) {
        return segmentation;
      }

      const currentSegment = segmentation[multiFeatureIndex]
        ? segmentation[multiFeatureIndex]
        : [];

      const coordToAdd = [x, imageHeight - y];

      // eslint-disable-next-line no-param-reassign
      segmentation[multiFeatureIndex] = [...currentSegment, ...coordToAdd];

      return segmentation;
    },
    []
  );
};

const convertLabelToCocoAnnotation = (
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
  categoryId: number
): CocoAnnotation => {
  return {
    id,
    image_id: imageId,
    category_id: categoryId,
    segmentation: convertGeometryToSegmentation(
      geometry,
      imageDimensions.height
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
  return labels.reduce((labelsCoco, label) => {
    if (label.labelClassId) {
      const cocoAnnotationId = labelsCoco.length + 1;
      labelsCoco.push(
        convertLabelToCocoAnnotation(
          label,
          cocoAnnotationId,
          imageIdsMap[label.imageId],
          labelClassIdsMap[label.labelClassId]
        )
      );
    }
    return labelsCoco;
  }, [] as CocoAnnotation[]);
};

const convertImageToCocoImage = async (
  image: DbImage,
  id: number,
  options: ExportOptionsCoco,
  ctx: Context
): Promise<CocoImage> => {
  const { createdAt, height, width, externalUrl, mimetype } = image;
  return {
    id,
    file_name: `${getImageName(
      image,
      options?.avoidImageNameCollisions ?? false
    )}.${mime.extension(mimetype)}`,
    coco_url: externalUrl ?? "",
    labelflow_url: options?.exportImages
      ? undefined
      : await getSignedImageUrl(image.url, ctx),
    date_captured: createdAt,
    height,
    width,
    license: 0,
  };
};

const convertImagesToCocoImages = async (
  images: DbImage[],
  options: ExportOptionsCoco,
  ctx: Context
) => {
  const imageIdsMap: Record<string, number> = {};
  const cocoImages = await Promise.all(
    images.map((image, index) => {
      const cocoImageId = index + 1;
      imageIdsMap[image.id] = cocoImageId;
      return convertImageToCocoImage(image, cocoImageId, options, ctx);
    })
  );

  return { cocoImages, imageIdsMap };
};

const convertLabelflowDatasetToCocoDataset = async (
  images: DbImage[],
  labels: DbLabelWithImageDimensions[],
  labelClasses: DbLabelClass[],
  options: ExportOptionsCoco,
  ctx: Context
): Promise<CocoDataset> => {
  const { cocoImages, imageIdsMap } = await convertImagesToCocoImages(
    images,
    options,
    ctx
  );
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
