import { initMockedDate } from "@labelflow/dev-utils/mockdate";
import { ExportFormat } from "../../../graphql-types/globalTypes";
import { getDatasetExportName } from "./get-dataset-export-name";

initMockedDate();

const DATASET_SLUG = "my-dataset-slug";
const EXPORT_FORMAT = ExportFormat.COCO;

describe(getDatasetExportName, () => {
  it("returns the correct name", () => {
    const exportName = getDatasetExportName(DATASET_SLUG, EXPORT_FORMAT);
    expect(exportName).toBe("my-dataset-slug-coco-2021-05-31T120000");
  });
});
