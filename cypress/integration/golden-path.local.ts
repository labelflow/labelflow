import { declareGoldenPathTests } from "./golden-path.common";

describe("Golden path", () => {
  declareGoldenPathTests({ workspaceSlug: "local", isLocal: true });
});
