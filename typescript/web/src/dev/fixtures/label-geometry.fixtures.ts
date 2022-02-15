import { LabelType } from "../../graphql-types/globalTypes";
import { LabelData } from "./data-types";

export const LABEL_GEOMETRY_DATA: Omit<
  LabelData,
  "id" | "imageId" | "labelClass"
> = {
  type: LabelType.Box,
  x: 100,
  y: 200,
  width: 100,
  height: 100,
  smartToolInput: null,
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [100, 200],
        [100, 300],
        [200, 300],
        [200, 200],
        [100, 200],
      ],
    ],
  },
};
