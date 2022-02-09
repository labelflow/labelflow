describe("Online workspaces access (online)", () => {
  it("Should ask for sign up modal when not signed in and creating a workspace", () => {
    cy.setCookie("hasUserTriedApp", "false");
    cy.setCookie("consentedCookies", "true");
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit("/");
    cy.contains("Skip the tutorial").click();

    // Open workspace switcher and click on create a new workspace
    cy.get('[aria-label="Open workspace selection popover"]').click();
    cy.get('[aria-label="Workspace selection menu popover"]')
      .contains("Create workspace")
      .click({ force: true });
    // Type a workspace name in the workspace creation modal
    cy.contains("Workspace Name").should("be.visible");
    cy.focused().type("Test workspace");
    cy.get('[aria-label="create workspace button"]').click();
    // Check that we were redirected to the sign in modal
    cy.url().should("match", /modal-signin/);
    cy.contains("Sign in to LabelFlow").should("be.visible");
  });
  it("Should allow to create a new workspace to a signed in user", () => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit("/?");
    // Check that we are logged in
    cy.get('[aria-label="User and Preferences"]').click();
    cy.contains("Cypress test user").should("be.visible");
    // Click on create workspace in workspace switcher
    cy.get('[aria-label="workspace name input"]').type("Test workspace");
    // Click on create workspace in workspace creation modal
    cy.get('[aria-label="create workspace button"]').click();
    cy.wait(420);
    // Check that we were redirected to the new workspace page
    cy.url().should("match", /test-workspace/);
    // Check that the new workspace is visible in the switcher
    cy.get('[aria-label="Open workspace selection popover"]').click();
    cy.get('[aria-label="Workspace selection menu popover"]')
      .contains("Test workspace")
      .should("exist");
  });
  it("Should allow a user to access one of his workspaces and the datasets in it", () => {
    // Login and create a workspace with datasets in it
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets");
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    // Check that the datasets are visible
    cy.visit("/cypress-test-workspace/datasets");
    cy.contains("Test dataset cypress").should("be.visible");
    // Check that the workspace is visible in the switcher
    cy.get('[aria-label="Open workspace selection popover"]').click();
    cy.get('[aria-label="Workspace selection menu popover"]')
      .contains("Cypress test workspace")
      .should("exist");
  });
});
