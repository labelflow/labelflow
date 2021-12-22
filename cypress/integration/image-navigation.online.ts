import { declateTests } from "./image-navigation.common";

describe("Image Navigation (online)", () => {
  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets");
  });

  declateTests({
    workspaceSlug: "cypress-test-workspace",
    getDatasetSlug: () => "test-dataset-cypress",
  });
});
