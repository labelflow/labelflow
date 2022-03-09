import { DbLabel } from "../../../types";

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
type Polygon = number[];

export type CocoAnnotation = {
  id: number;
  image_id: number;
  category_id: number;
  segmentation: Polygon[];
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
  coco_url: string;
  labelflow_url?: string;
  date_captured: string;
};

export type CocoDataset = {
  info: CocoInfo;
  licenses: CocoLicense[];
  categories: CocoCategory[];
  images: CocoImage[];
  annotations: CocoAnnotation[];
};

export type CacheLabelClassIdToCocoCategoryId = Map<string, number>;

export type DbLabelWithImageDimensions = DbLabel & {
  imageDimensions: { width: number; height: number };
};

export type DbLabelWithImageDimensionsAndLabelClass = Omit<
  DbLabelWithImageDimensions,
  "labelClassId"
> & {
  labelClassId: string;
};
