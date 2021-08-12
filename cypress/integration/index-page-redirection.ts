describe("Index page redirection when user has tried app", () => {
  it("Redirects to image page when user tries App and did not see demo project", () => {
    cy.clearCookies();
    cy.setCookie("hasUserTriedApp", "true");
    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);
    cy.url().should(
      "match",
      /.\/projects\/([a-zA-Z0-9_-]*)\/images\/([a-zA-Z0-9_-]*)/
    );
  });

  it("Redirects to projects page when user tries App and did already see demo project", () => {
    cy.setCookie("didVisitDemoProject", "true");
    cy.setCookie("hasUserTriedApp", "true");
    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);
    cy.url().should("match", /.\/projects/);
  });
});

describe("Index page when user has not tried app", () => {
  it("Displays website on first user visit", () => {
    cy.clearCookies();

    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);

    cy.get("body").contains("Labelflow, All rights reserved").should("exist");
  });
});
