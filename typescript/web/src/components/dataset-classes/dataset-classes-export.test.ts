import { waitFor } from "@testing-library/react";
import { exportDatasetClasses, generateCsv } from "./dataset-classes-export";
import {
  DATASET_SLUG,
  LABEL_CLASSES_DATA,
} from "./dataset-classes-export.fixtures";

describe("LabelClasses CSV export", () => {
  it("Generates proper CSV", async () => {
    expect(await generateCsv(LABEL_CLASSES_DATA)).toMatchSnapshot();
  });

  it("Triggers download of the CSV file", async () => {
    window.URL.createObjectURL = jest.fn();
    const createElementOriginal = document.createElement.bind(document);
    const onDownload = jest.fn();
    jest
      .spyOn(document, "createElement")
      .mockImplementation((name, options) => {
        const element = createElementOriginal(name, options);
        if (name === "a") {
          element.click = onDownload;
        }
        return element;
      });
    await exportDatasetClasses(DATASET_SLUG, LABEL_CLASSES_DATA);
    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(onDownload).toHaveBeenCalledTimes(1);
    });
  });
});
