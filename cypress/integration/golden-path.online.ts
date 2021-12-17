import { declareTests } from "./golden-path.common";

describe("Golden path (online)", () => {
  beforeEach(() => {
    // Login and create a workspace with datasets in it
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets");
  });
  declareTests({ workspaceSlug: "cypress-test-workspace" });
});
