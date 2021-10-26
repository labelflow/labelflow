describe("Golden path for online workspaces", () => {
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

    cy.get('[aria-label="Open workspace selection popover"]').click();

    cy.get('[aria-label="Workspace selection menu popover"]')
      .contains("Create workspace")
      .click({ force: true }); // TODO: fix this, we should not use {force:true}, but try to understand why Cypress thinks it's not visible
    cy.contains("Workspace Name").should("be.visible");
    cy.focused().type("Test workspace");
    cy.get('[aria-label="Create workspace"]').click();
    cy.url().should("match", /\/test-workspace\/datasets/);
  });
});
