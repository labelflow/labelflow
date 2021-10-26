describe("Online workspaces access", () => {
  it("Should ask for sign up modal when not signed in and creating a workspace", () => {
    cy.setCookie("hasUserTriedApp", "false");
    cy.setCookie("consentedCookies", "true");
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit("/local/datasets?modal-update-service-worker=update");
    cy.contains("Skip the tutorial").click();

    cy.get('[aria-label="Open workspace selection popover"]').click();

    cy.get('[aria-label="Workspace selection menu popover"]')
      .contains("Create workspace")
      .click({ force: true }); // TODO: fix this, we should not use {force:true}, but try to understand why Cypress thinks it's not visible
    cy.contains("Workspace Name").should("be.visible");
    cy.focused().type("Test workspace");
    cy.get('[aria-label="Create workspace"]').click();
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
    cy.visit("/local/datasets?modal-update-service-worker=update");
    cy.get('[aria-label="User and Preferences"]').click();
    cy.contains("Cypress test user").should("be.visible");
    cy.get('[aria-label="Open workspace selection popover"]').click();
    cy.get('[aria-label="Workspace selection menu popover"]')
      .contains("Create workspace")
      .click({ force: true }); // TODO: fix this, we should not use {force:true}, but try to understand why Cypress thinks it's not visible
    cy.contains("Workspace Name").should("be.visible");
    cy.focused().type("Test workspace");
    cy.get('[aria-label="Create workspace"]').click();
    cy.wait(420);
    cy.get('[aria-label="Open workspace selection popover"]').click();
    cy.get('[aria-label="Workspace selection menu popover"]')
      .contains("Test workspace")
      .should("be.visible"); // TODO: this fails because cypress says the element is not visible, when it is. Fix this
    cy.url().should("match", /test-workspace/); // TODO: redirection works only sometimes, so this fails pretty often
  });
  it("Should allow a user to access one of his workspaces and the datasets in it", () => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets");
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    cy.visit("/cypress-test-workspace/datasets?");
    cy.contains("Test dataset cypress").should("be.visible");
    cy.get('[aria-label="Open workspace selection popover"]').click();
    cy.get('[aria-label="Workspace selection menu popover"]')
      .contains("Cypress test workspace")
      .should("be.visible"); // TODO: this fails because cypress says the element is not visible, when it is. Fix this
  });
});
