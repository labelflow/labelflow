import {
  previousHexToNextHexMap,
  getNextClassColor,
} from "../class-color-generator";

test("Class color generator mapping has the right value", () => {
  expect(previousHexToNextHexMap).toMatchSnapshot();
});

it("Gets the next hex color from previous valid hex color", () => {
  expect(getNextClassColor("#84cc16")).toEqual("#06b6d4");
});

it("It throws when a non valid hex color is passed", () => {
  expect(() => getNextClassColor("#000000")).toThrow();
});
