// export const hexColorSequence = [
//   "#ef4444",
//   "#eab308",
//   "#10b981",
//   "#0ea5e9",
//   "#8b5cf6",
//   "#ec4899",
//   "#f97316",
//   "#84cc16",
//   "#14b8a6",
//   "#3b82f6",
//   "#a855f7",
//   "#f43f5e",
//   "#f59e0b",
//   "#22c55e",
//   "#06b6d4",
//   "#6366f1",
//   "#d946ef",
// ];

// export const hexColorSequence400 = [
//   "#F87171",
//   "#FACC15",
//   "#34D399",
//   "#38BDF8",
//   "#A78BFA",
//   "#F472B6",
//   "#FB923C",
//   "#A3E635",
//   "#2DD4BF",
//   "#60A5FA",
//   "#C084FC",
//   "#FB7185",
//   "#FBBF24",
//   "#4ADE80",
//   "#22D3EE",
//   "#818CF8",
//   "#E879F9",
// ];

// const hexColorSequence600 = [
//   "#DC2626",
//   "#CA8A04",
//   "#059669",
//   "#0284C7",
//   "#7C3AED",
//   "#DB2777",
//   "#EA580C",
//   "#65A30D",
//   "#0D9488",
//   "#2563EB",
//   "#9333EA",
//   "#E11D48",
//   "#D97706",
//   "#16A34A",
//   "#0891B2",
//   "#4F46E5",
//   "#C026D3",
// ];

export const hexColorSequence = [
  "#F87171",
  "#FACC15",
  "#34D399",
  "#38BDF8",
  "#A78BFA",
  "#DB2777",
  "#FB923C",
  "#65A30D",
  "#0D9488",
  "#2563EB",
  "#9333EA",
  "#FB7185",
  "#FBBF24",
  "#4ADE80",
  "#22D3EE",
  "#818CF8",
  "#E879F9",
  "#DC2626",
  "#CA8A04",
  "#059669",
  "#0284C7",
  "#7C3AED",
  "#F472B6",
  "#EA580C",
  "#A3E635",
  "#2DD4BF",
  "#60A5FA",
  "#C084FC",
  "#E11D48",
  "#D97706",
  "#16A34A",
  "#0891B2",
  "#4F46E5",
  "#C026D3",
];

// It's charkra's gray.200
export const noneClassColor = "#E2E8F0";

export const previousHexToNextHexMap: { [key: string]: string } =
  hexColorSequence.reduce((accumulator, colorHex, index) => {
    const indexOfNextColor = (index + 1) % hexColorSequence.length; // The number that you are adding to index and the length of the array have to be prime numbers between each other
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
