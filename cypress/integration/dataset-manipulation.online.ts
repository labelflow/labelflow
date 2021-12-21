import { declareTests } from "./dataset-manipulation.common";

describe("Dataset creation, edition, deletion (online)", () => {
  beforeEach(() => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspace");
  });
  declareTests({ workspaceSlug: "cypress-test-workspace" });
});
