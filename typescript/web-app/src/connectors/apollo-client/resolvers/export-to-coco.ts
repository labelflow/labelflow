import { Label, LabelClass, Image } from "../../../types.generated";

/**
 * Query tout les labelclass -> categories (cache: Map<uuid, id>);
 * Query toutes les images avec labels -> annotations + images (reducer (etatCourantDataset, labelClass ou image) -> nouveauDataset);
 */

export type CocoLicense = {
  name: string;
  id: number;
  url: string;
};

export type CocoInfo = {
  contributor: string;
  date_created: string;
  description: string;
  url: string;
  version: string;
  year: string;
};

export type CocoCategory = {
  id: number;
  name: string;
  supercategory: string;
};

type Polygon = number[][];

export type CocoAnnotation = {
  id: number;
  image_id: number;
  category_id: number | null;
  segmentation: string | Polygon;
  area: number;
  bbox: [x: number, y: number, width: number, height: number];
  iscrowd: 0 | 1;
};

export type CocoImage = {
  id: number;
  width: number;
  height: number;
  file_name: string;
  license: number;
  flickr_url: string;
  coco_url: string;
  date_captured: string;
};

export type CocoDataset = {
  info: CocoInfo;
  licenses: CocoLicense[];
  categories: CocoCategory[];
  images: CocoImage[];
  annotations: CocoAnnotation[];
};

export type CacheLabelClassIdToCocoCategoryId = Map<string | undefined, number>;

const initCocoDataset: Pick<CocoDataset, "info" | "licenses"> = {
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
};

export const convertLabelClassToCocoCategory = (
  labelClass: LabelClass,
  id: number
): CocoCategory => {
  return {
    id,
    name: labelClass.name,
    supercategory: "",
  };
};

export const convertLabelClassesToCocoCategories = (
  labelClasses: LabelClass[]
): CocoCategory[] => {
  return labelClasses.map((value, index) =>
    convertLabelClassToCocoCategory(value, index + 1)
  );
};

export const convertLabelToCocoAnnotation = (
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

export const convertLabelsOfImageToCocoAnnotations = (
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

export const convertImageToCocoImage = (
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

export const addImageToCocoDataset =
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

export const convertImagesAndLabelClassesToCocoDataset = (
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
    ...initCocoDataset,
    annotations: [],
    categories,
    images: [],
  };
  const addImageToCocoDatasetWithMapping = addImageToCocoDataset(mapping);

  return images.reduce(addImageToCocoDatasetWithMapping, initialDataset);
};

const exportToCoco = async (_: any): Promise<String | undefined> => {
  return "{}";
};

export default {
  Query: {
    exportToCoco,
  },
};
