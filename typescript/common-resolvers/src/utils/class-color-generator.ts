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

const createColorHashMap = (attibutedColors: string[]) => {
  const hashMap: { [key: string]: number } = {};
  attibutedColors.forEach((attributedColor) => {
    if (attributedColor in hashMap) {
      hashMap[attributedColor] += 1;
    } else {
      hashMap[attributedColor] = 1;
    }
  });

  return hashMap;
};

const getColorNotAttributed = (
  numberOfAttributedColors: number,
  attibutedColors: string[]
) => {
  for (let i = 0; i < numberOfAttributedColors; i += 1) {
    if (!attibutedColors.includes(hexColorSequence[i])) {
      return hexColorSequence[i];
    }
  }

  return hexColorSequence[numberOfAttributedColors];
};

const getFirstColorLessAttributed = (
  numberOfAttributedColors: number,
  attibutedColors: string[],
  overflow: number
) => {
  const hashMap: { [key: string]: number } =
    createColorHashMap(attibutedColors);

  const targetNumberOfOccurrences = Math.floor(
    numberOfAttributedColors / hexColorSequence.length
  );

  for (let i = 0; i < overflow; i += 1) {
    if (hashMap[hexColorSequence[i]] === targetNumberOfOccurrences) {
      return hexColorSequence[i];
    }
  }

  return hexColorSequence[overflow];
};
export const getNextClassColor = (attibutedColors: string[]): string => {
  const numberOfAttributedColors = attibutedColors.length;
  const overflow = numberOfAttributedColors % hexColorSequence.length;

  if (overflow === 0) {
    // If the rest of the division is 0, all colors have been attributed once or several
    // times, so we return the first color of the array
    return hexColorSequence[0];
  }

  if (numberOfAttributedColors < hexColorSequence.length) {
    // If number of attributed colors is strictly less than the number of available colors, we
    // want the first color not attributed already
    return getColorNotAttributed(numberOfAttributedColors, attibutedColors);
  }

  // Last case is all colors have been attributed at least once, but not a number of times that
  // is a multiple of hexColorSequence. We want the first color with the smallest number of attributions
  return getFirstColorLessAttributed(
    numberOfAttributedColors,
    attibutedColors,
    overflow
  );
};
