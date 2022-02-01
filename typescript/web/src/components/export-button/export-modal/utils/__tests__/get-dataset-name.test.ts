import { initMockedDate } from "@labelflow/dev-utils/mockdate";
import { ExportFormat } from "../../../../../graphql-types/globalTypes";
import { getDatasetExportName } from "../get-dataset-name";

initMockedDate();

const DATASET_SLUG = "my-dataset-slug";
const EXPORT_FORMAT = ExportFormat.COCO;

describe("Get dataset export name", () => {
  it("Returns the correct name", () => {
    const exportName = getDatasetExportName({
      datasetSlug: DATASET_SLUG,
      format: EXPORT_FORMAT,
    });
    expect(exportName).toBe("my-dataset-slug-coco-2021-05-31T120000");
  });
});
