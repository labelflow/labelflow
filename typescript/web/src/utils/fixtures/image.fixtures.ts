import { BASIC_DATASET_DATA } from "./dataset.fixtures";
import { ImageData } from "./data-types";

export const BASIC_IMAGE_DATA: ImageData = {
  ...BASIC_DATASET_DATA.images[0],
  dataset: BASIC_DATASET_DATA,
};
