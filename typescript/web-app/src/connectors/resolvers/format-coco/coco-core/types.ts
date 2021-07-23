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
  category_id: number | null;
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
