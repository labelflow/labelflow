const iogMaskIdSuffix = "-iog-mask";

export const getIogMaskIdFromLabelId = (labelId: string): string =>
  `${labelId}${iogMaskIdSuffix}`;
export const getLabelIdFromIogMaskId = (iogMaskId: string): string =>
  iogMaskId.split(iogMaskIdSuffix)[0];

export const iogMaskColor = "#DDDDDD";

export const extractIogMaskFromLabel = (
  label: {
    smartToolInput: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  },
  imageWidth: number,
  imageHeight: number
): number[][][] => {
  return [
    [
      [0, 0],
      [imageWidth, 0],
      [imageWidth, imageHeight],
      [0, imageHeight],
      [0, 0],
    ],
    [
      [label.smartToolInput.x, label.smartToolInput.y],
      [
        label.smartToolInput.x + label.smartToolInput.width,
        label.smartToolInput.y,
      ],
      [
        label.smartToolInput.x + label.smartToolInput.width,
        label.smartToolInput.y + label.smartToolInput.height,
      ],
      [
        label.smartToolInput.x,
        label.smartToolInput.y + label.smartToolInput.height,
      ],
      [label.smartToolInput.x, label.smartToolInput.y],
    ],
  ];
};

export const extractSmartToolInputInputFromIogMask = (
  coordinates: number[][][]
): { x: number; y: number; width: number; height: number } => {
  const xCoordinates = coordinates[coordinates.length - 1].map(
    (point) => point[0]
  );
  const yCoordinates = coordinates[coordinates.length - 1].map(
    (point) => point[1]
  );
  const [x, y, destX, destY] = [
    Math.min(...xCoordinates),
    Math.min(...yCoordinates),
    Math.max(...xCoordinates),
    Math.max(...yCoordinates),
  ];
  return {
    x,
    y,
    width: destX - x,
    height: destY - y,
  };
};

export const extractImageDimensionsFromIogMask = (
  coordinates: number[][][]
): { width: number; height: number } => {
  const xCoordinates = coordinates[0].map((point) => point[0]);
  const yCoordinates = coordinates[0].map((point) => point[1]);
  return {
    width: Math.max(...xCoordinates),
    height: Math.max(...yCoordinates),
  };
};
