import {
  ValidMimeTypeCategory,
  isFilePathOfValidMimeTypeCategory,
} from "./validate-upload-mime-types";

describe("isFilePathOfValidMimeTypeCategory", () => {
  test("Should spot a valid image filename", () => {
    expect(
      isFilePathOfValidMimeTypeCategory(
        "image.jpg",
        ValidMimeTypeCategory.image
      )
    ).toBeTruthy();
  });
  test("Should spot a valid image path", () => {
    expect(
      isFilePathOfValidMimeTypeCategory(
        "some/random/path/to/my/image.jpg",
        ValidMimeTypeCategory.image
      )
    ).toBeTruthy();
  });
  test("Should spot a valid image filename with an uncommon uppercase extension", () => {
    expect(
      isFilePathOfValidMimeTypeCategory(
        "image.JPEG",
        ValidMimeTypeCategory.image
      )
    ).toBeTruthy();
  });
  test("Should spot an invalid (unsupported) image filename", () => {
    expect(
      isFilePathOfValidMimeTypeCategory(
        "image.tiff",
        ValidMimeTypeCategory.image
      )
    ).toBeFalsy();
  });
  test("Should spot a valid upload filename", () => {
    expect(isFilePathOfValidMimeTypeCategory("archive.zip")).toBeTruthy();
  });
  test("Should spot an invalid upload filename", () => {
    expect(isFilePathOfValidMimeTypeCategory("archive.tar.gz")).toBeFalsy();
  });
});
