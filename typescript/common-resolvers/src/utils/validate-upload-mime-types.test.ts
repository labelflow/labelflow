import {
  ValidMimeTypeCategory,
  isFilePathOfValidMimeTypeCategory,
} from "./validate-upload-mime-types";

describe(isFilePathOfValidMimeTypeCategory, () => {
  it("spots a valid image filename", () => {
    expect(
      isFilePathOfValidMimeTypeCategory(
        "image.jpg",
        ValidMimeTypeCategory.image
      )
    ).toBeTruthy();
  });

  it("spots a valid image path", () => {
    expect(
      isFilePathOfValidMimeTypeCategory(
        "some/random/path/to/my/image.jpg",
        ValidMimeTypeCategory.image
      )
    ).toBeTruthy();
  });

  it("spots a valid image filename with an uncommon uppercase extension", () => {
    expect(
      isFilePathOfValidMimeTypeCategory(
        "image.JPEG",
        ValidMimeTypeCategory.image
      )
    ).toBeTruthy();
  });

  it("spots an invalid (unsupported) image filename", () => {
    expect(
      isFilePathOfValidMimeTypeCategory(
        "image.tiff",
        ValidMimeTypeCategory.image
      )
    ).toBeFalsy();
  });

  it("spots a valid upload filename", () => {
    expect(isFilePathOfValidMimeTypeCategory("archive.zip")).toBeTruthy();
  });

  it("spots an invalid upload filename", () => {
    expect(isFilePathOfValidMimeTypeCategory("archive.tar.gz")).toBeFalsy();
  });
});
