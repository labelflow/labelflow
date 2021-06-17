export const hexColorSequence = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
];
export const previousHexToNextHexMap: { [key: string]: string } =
  hexColorSequence.reduce((accumulator, colorHex, index) => {
    const indexOfNextColor = (index + 4) % hexColorSequence.length; // The number that you are adding to index and the length of the array have to be prime numbers between each other
    const nextColorHex = hexColorSequence[indexOfNextColor];
    return {
      ...accumulator,
      [colorHex]: nextColorHex,
    };
  }, {});
export const getNextClassColor = (lastHexClassColor: string): string => {
  if (lastHexClassColor in previousHexToNextHexMap) {
    return previousHexToNextHexMap?.[lastHexClassColor];
  }
  throw new Error(
    `Unrecognized color ${lastHexClassColor} passed to getNextClassColor, it should be one among:\n\t- ${Object.keys(
      previousHexToNextHexMap
    ).join("\n\t- ")}`
  );
};
