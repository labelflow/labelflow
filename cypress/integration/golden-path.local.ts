import { declareGoldenPathTests } from "./golden-path.common";

describe("Golden path (local)", () => {
  declareGoldenPathTests({ workspaceSlug: "local", isLocal: true });
});
