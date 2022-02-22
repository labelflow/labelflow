import { Context } from "../types";
import { createCsv } from "./export-to-csv";
import { MOCK_REPOSITORY, DATASET_DATA } from "./export-to-csv.fixtures";

describe("CSV export", () => {
  it("Generates proper CSV", async () => {
    expect(
      await createCsv(DATASET_DATA.id, {
        repository: MOCK_REPOSITORY,
      } as Context)
    ).toMatchSnapshot();
  });
});
