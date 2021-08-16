describe("Index page redirection when user has tried app", () => {
  it("Redirects to image page when user tries App and did not see demo dataset", () => {
    cy.setCookie("hasUserTriedApp", "true");
    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);
    cy.url().should(
      "match",
      /.\/datasets\/([a-zA-Z0-9_-]*)\/images\/([a-zA-Z0-9_-]*)/
    );
  });

  it("Redirects to datasets page when user tries App and did already see demo dataset", () => {
    cy.setCookie("didVisitDemoDataset", "true");
    cy.setCookie("hasUserTriedApp", "true");
    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);
    cy.url().should("match", /.\/datasets/);
  });
});

describe("Index page when user has not tried app", () => {
  it("Displays website on first user visit", () => {
    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);

    cy.get("body").contains("Labelflow, All rights reserved").should("exist");
  });
});
