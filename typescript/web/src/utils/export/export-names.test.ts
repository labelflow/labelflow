import { initMockedDate } from "@labelflow/dev-utils/mockdate";
import {
  getDatasetClassesExportName,
  getDatasetExportName,
} from "./export-names";

initMockedDate();

const DATASET_SLUG = "my-dataset-slug";

describe(getDatasetExportName, () => {
  it("returns the correct name", () => {
    const exportName = getDatasetExportName(DATASET_SLUG);
    expect(exportName).toBe("my-dataset-slug-2021-05-31T120000");
  });
});

describe(getDatasetClassesExportName, () => {
  it("returns the correct name", () => {
    const exportName = getDatasetClassesExportName(DATASET_SLUG);
    expect(exportName).toBe("my-dataset-slug-classes-2021-05-31T120000");
  });
});
