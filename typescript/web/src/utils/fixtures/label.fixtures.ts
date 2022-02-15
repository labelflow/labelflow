import { LabelData } from "./data-types";
import { BASIC_IMAGE_DATA } from "./image.fixtures";
import { BASIC_LABEL_CLASS_DATA } from "./label-class.fixtures";
import { LABEL_GEOMETRY_DATA } from "./label-geometry.fixtures";

export const BASIC_LABEL_DATA: LabelData = {
  id: "87a60aa2-8057-11ec-80be-5f791a5254d5",
  labelClass: BASIC_LABEL_CLASS_DATA,
  imageId: BASIC_IMAGE_DATA.id,
  ...LABEL_GEOMETRY_DATA,
};
