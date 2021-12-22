import type { GeometryInput, LabelType } from "@labelflow/graphql-types";
import { LabelType as LabelTypeOptions } from "@labelflow/graphql-types";

import { range } from "lodash/fp";

export const isCocoSegmentationBox = (
  cocoSegmentation: number[][]
): boolean => {
  if (!cocoSegmentation || cocoSegmentation.length === 0) {
    return true;
  }
  if (cocoSegmentation.length > 1 || cocoSegmentation[0].length !== 10) {
    return false;
  }
  const maybeBox = cocoSegmentation[0].map(Math.floor);
  const { x: xValues, y: yValues } = maybeBox.reduce(
    ({ x, y }, value, index) => {
      if (index % 2 === 0) {
        x.add(value);
      } else {
        y.add(value);
      }
      return { x, y };
    },
    { x: new Set(), y: new Set() }
  );
  const { isDegenerate: polygonIsDegenerate } = range(
    0,
    maybeBox.length / 2 - 2
  ).reduce(
    ({ isDegenerate, crossProductSign }, index) => {
      if (isDegenerate) {
        return { isDegenerate, crossProductSign };
      }
      const xA = maybeBox[2 * index + 2] - maybeBox[2 * index];
      const yA = maybeBox[2 * index + 3] - maybeBox[2 * index + 1];
      const xB = maybeBox[2 * index + 4] - maybeBox[2 * index + 2];
      const yB = maybeBox[2 * index + 5] - maybeBox[2 * index + 3];
      const currentCrossProductSign = Math.sign(xA * yB - xB * yA);
      if (crossProductSign && crossProductSign !== currentCrossProductSign) {
        return { crossProductSign: 0, isDegenerate: true };
      }
      return {
        crossProductSign: currentCrossProductSign,
        isDegenerate: false,
      };
    },
    { isDegenerate: false, crossProductSign: 0 }
  );
  return xValues.size === 2 && yValues.size === 2 && !polygonIsDegenerate;
};

export const convertGeometryFromCocoAnnotationToLabel = (
  cocoSegmentation: number[][],
  bbox: number[], // [x, y, width, height]
  imageHeight: number
): { geometry: GeometryInput; type: LabelType } => ({
  type: isCocoSegmentationBox(cocoSegmentation)
    ? LabelTypeOptions.Box
    : LabelTypeOptions.Polygon,
  geometry: {
    type: "Polygon",
    coordinates:
      !cocoSegmentation || cocoSegmentation.length === 0
        ? [
            [
              [bbox[0], bbox[1] + bbox[3]],
              [bbox[0], bbox[1]],
              [bbox[0] + bbox[2], bbox[1]],
              [bbox[0] + bbox[2], bbox[1] + bbox[3]],
              [bbox[0], bbox[1] + bbox[3]],
            ],
          ]
        : cocoSegmentation.map((cocoPolygon) =>
            range(0, cocoPolygon.length / 2).map((index) => [
              cocoPolygon[2 * index],
              imageHeight - cocoPolygon[2 * index + 1],
            ])
          ),
  },
});
