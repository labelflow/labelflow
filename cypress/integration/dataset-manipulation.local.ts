import { declareTests } from "./dataset-manipulation.common";

describe("Dataset creation, edition, deletion (local)", () => {
  declareTests({ workspaceSlug: "local" });
});
