import imageSampleCollection from "../../typescript/web/src/utils/image-sample-collection";

describe("Golden path", () => {
  it("Should execute the golden path with online workspaces without errors", () => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("hasUserTriedApp", "false");
    cy.setCookie("consentedCookies", "true");
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit("/local/datasets?modal-update-service-worker=update");
    cy.contains("Skip the tutorial").click();

    cy.get('[aria-label="User and Preferences"]').click();
    cy.contains("Cypress test user").should("be.visible");
  });
});
