describe("Index page redirection when user has tried app", () => {
  it("Redirects to datasets page when user visits app and has tried app", () => {
    cy.setCookie("hasUserTriedApp", "true");
    cy.visit(`/?modal-update-service-worker=update`);
    cy.url().should("match", /\/local\/datasets/);
  });
});

describe("Index page when user has not tried app", () => {
  it("Redirects to tutorial dataset first image page when user visits app and has not tried App", () => {
    cy.setCookie("hasUserTriedApp", "false");
    cy.visit(`/local/datasets?modal-update-service-worker=update`);
    cy.contains("Get started").click();
    cy.url().should(
      "match",
      /\/local\/datasets\/tutorial-dataset\/images\/2bbbf664-5810-4760-a10f-841de2f35510/
    );
    cy.setCookie("hasUserTriedApp", "false");
  });
  it("Displays website on first user visit", () => {
    cy.setCookie("hasUserTriedApp", "false");
    cy.visit(`/?modal-update-service-worker=update`);
    cy.url().should("match", /\/website/);
    cy.get("body").contains("Labelflow, All rights reserved").should("exist");
  });
});
