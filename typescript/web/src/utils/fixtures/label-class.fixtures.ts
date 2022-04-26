import { LabelClassData } from "./data-types";
import { DEEP_DATASET_WITH_CLASSES_DATA } from "./dataset.fixtures";

export const BASIC_LABEL_CLASS_DATA: LabelClassData = {
  ...DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[0],
  dataset: DEEP_DATASET_WITH_CLASSES_DATA,
};
