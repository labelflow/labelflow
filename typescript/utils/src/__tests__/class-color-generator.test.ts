import {
  getNextClassColor,
  LABEL_CLASS_COLOR_PALETTE,
} from "../class-color-generator";

const firstColor = LABEL_CLASS_COLOR_PALETTE[0];
const thirdColor = LABEL_CLASS_COLOR_PALETTE[2];
const firstTwoInOrder = LABEL_CLASS_COLOR_PALETTE.slice(0, 2);
const firstTwoReversed = [LABEL_CLASS_COLOR_PALETTE[1], firstColor];
const secondAndThird = LABEL_CLASS_COLOR_PALETTE.slice(1, 3);

it("Gets the first color if no color has been attributed", () => {
  expect(getNextClassColor([])).toEqual(firstColor);
});

it("Gets the third hex color when the first two are passed in order", () => {
  expect(getNextClassColor(firstTwoInOrder)).toEqual(thirdColor);
});

it("Gets the third hex color even if the first two are not in order", () => {
  expect(getNextClassColor(firstTwoReversed)).toEqual(thirdColor);
});

it("Gets the first hex color if we pass only the second and the third", () => {
  expect(getNextClassColor(secondAndThird)).toEqual(firstColor);
});

it("Gets the first hex color if all colors have been attributed", () => {
  expect(getNextClassColor(LABEL_CLASS_COLOR_PALETTE)).toEqual(firstColor);
});

it("Gets the first hex color if all colors have been attributed, then second and third colors have been attributed again", () => {
  expect(
    getNextClassColor([...LABEL_CLASS_COLOR_PALETTE, ...secondAndThird])
  ).toEqual(firstColor);
});
