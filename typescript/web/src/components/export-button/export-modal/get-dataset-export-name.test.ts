import { initMockedDate } from "@labelflow/dev-utils/mockdate";
import { getDatasetExportName } from "./get-dataset-export-name";

initMockedDate();

const DATASET_SLUG = "my-dataset-slug";

describe(getDatasetExportName, () => {
  it("returns the correct name", () => {
    const exportName = getDatasetExportName(DATASET_SLUG);
    expect(exportName).toBe("my-dataset-slug-2021-05-31T120000");
  });
});
