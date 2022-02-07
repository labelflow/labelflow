import {
  isCocoSegmentationBox,
  convertGeometryFromCocoAnnotationToLabel,
} from "./converters";

describe("isCocoSegmentationBox", () => {
  test("Should spot segmentation box", () => {
    expect(
      isCocoSegmentationBox([
        [
          123.33, 254.0001, 369.12346, 254.0005, 369.12348, 567.09436, 123.33,
          567.09456, 123.33, 254.0001,
        ],
      ])
    ).toBeTruthy();
  });
  test("Should consider an empty segmentation to a box, based on the bounding box", () => {
    expect(isCocoSegmentationBox([])).toBeTruthy();
  });
  test("Should discard segmentation with more than one polygon", () => {
    expect(
      isCocoSegmentationBox([
        [
          123.33, 254.0001, 369.12346, 254.0005, 369.12348, 567.09436, 123.33,
          567.09456, 123.33, 254.0001,
        ],
        [100, 0],
      ])
    ).toBeFalsy();
  });
  test("Should discard segmentation with more than ten coordinates", () => {
    expect(
      isCocoSegmentationBox([
        [
          123.33, 254.0001, 369.12346, 254.0005, 369.12348, 567.09436, 123.33,
          567.09456, 123.33, 254.0001, 100, 0,
        ],
      ])
    ).toBeFalsy();
  });
  test("Should discard reordered segmentation of a box", () => {
    expect(
      isCocoSegmentationBox([
        [
          123.33, 254.0001, 369.12346, 254.0005, 369.12348, 567.09436, 123.33,
          567.09456, 254.0001, 123.33,
        ],
      ])
    ).toBeFalsy();
  });
  test("Should discard degenerated box (reordered points)", () => {
    expect(
      isCocoSegmentationBox([
        [
          123.33, 254.0001, 369.12348, 567.09436, 369.12346, 254.0005, 123.33,
          567.09456, 123.33, 254.0001,
        ],
      ])
    ).toBeFalsy();
  });
});

describe("convertGeometryFromCocoAnnotationToLabel", () => {
  test("Should convert a box into a box", () => {
    expect(
      convertGeometryFromCocoAnnotationToLabel(
        [
          [
            123.33, 254.0001, 369.12346, 254.0005, 369.12348, 567.09436, 123.33,
            567.09456, 123.33, 254.0001,
          ],
        ],
        [0, 0, 568, 568],
        568
      )
    ).toMatchSnapshot();
  });
  test("Should convert an empty segmentation's bounding box into a box", () => {
    expect(
      convertGeometryFromCocoAnnotationToLabel([], [100, 200, 300, 400], 700)
    ).toMatchSnapshot();
  });
  test("Should convert a polygon into a polygon", () => {
    expect(
      convertGeometryFromCocoAnnotationToLabel(
        [
          [
            123.33, 254.0001, 369.12346, 254.0005, 369.12348, 567.09436, 123.33,
            567.09456, 100, 550, 123.33, 254.0001,
          ],
        ],
        [0, 0, 568, 568],
        568
      )
    ).toMatchSnapshot();
  });
});
