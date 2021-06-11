import colors from "tailwindcss/colors";
import { get } from "lodash/fp";

const colorSequence = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "lightBlue",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

export const hexColorSequence = colorSequence.map((colorName) =>
  get(`${colorName}.500`, colors)
);
export const previousHexToNextHexMap: { [key: string]: string } =
  colorSequence.reduce((accumulator, colorName, index) => {
    const indexOfNextColor = (index + 4) % colorSequence.length; // The number that you are adding to index and the length of the array have to be prime numbers between each other
    const nextColorName = colorSequence[indexOfNextColor];
    return {
      ...accumulator,
      [get(`${colorName}.500`, colors)]: get(`${nextColorName}.500`, colors),
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
