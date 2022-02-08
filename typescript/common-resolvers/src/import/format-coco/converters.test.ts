import {
  isCocoSegmentationBox,
  convertGeometryFromCocoAnnotationToLabel,
} from "./converters";

describe(isCocoSegmentationBox, () => {
  it("spots segmentation box", () => {
    expect(
      isCocoSegmentationBox([
        [
          123.33, 254.0001, 369.12346, 254.0005, 369.12348, 567.09436, 123.33,
          567.09456, 123.33, 254.0001,
        ],
      ])
    ).toBeTruthy();
  });

  it("considers an empty segmentation to a box, based on the bounding box", () => {
    expect(isCocoSegmentationBox([])).toBeTruthy();
  });

  it("discards segmentation with more than one polygon", () => {
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

  it("discards segmentation with more than ten coordinates", () => {
    expect(
      isCocoSegmentationBox([
        [
          123.33, 254.0001, 369.12346, 254.0005, 369.12348, 567.09436, 123.33,
          567.09456, 123.33, 254.0001, 100, 0,
        ],
      ])
    ).toBeFalsy();
  });

  it("discards reordered segmentation of a box", () => {
    expect(
      isCocoSegmentationBox([
        [
          123.33, 254.0001, 369.12346, 254.0005, 369.12348, 567.09436, 123.33,
          567.09456, 254.0001, 123.33,
        ],
      ])
    ).toBeFalsy();
  });

  it("discards degenerated box (reordered points)", () => {
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

describe(convertGeometryFromCocoAnnotationToLabel, () => {
  it("converts a box into a box", () => {
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

  it("converts an empty segmentation's bounding box into a box", () => {
    expect(
      convertGeometryFromCocoAnnotationToLabel([], [100, 200, 300, 400], 700)
    ).toMatchSnapshot();
  });

  it("converts a polygon into a polygon", () => {
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
