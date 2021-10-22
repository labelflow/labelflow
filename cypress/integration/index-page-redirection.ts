describe("Index page redirections", () => {
  it("Redirects to datasets page when user visits app and has tried app", () => {
    cy.setCookie("consentedCookies", "true");
    cy.setCookie("hasUserTriedApp", "true");
    cy.visit(`/?modal-update-service-worker=update`);
    cy.url().should("match", /\/local\/datasets/);
  });

  it("Redirects to tutorial dataset first image page when user visits app and has not tried App", () => {
    cy.setCookie("consentedCookies", "true");
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
    cy.setCookie("consentedCookies", "true");
    cy.setCookie("hasUserTriedApp", "false");
    cy.visit(`/?modal-update-service-worker=update`);
    cy.url().should("match", /\/website/);
    cy.get("body").contains("LabelFlow, All rights reserved").should("exist");
  });

  it("Redirects to the last visited workspace", () => {
    cy.setCookie("consentedCookies", "true");
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("lastVisitedWorkspaceSlug", "my-workspace");
    cy.visit(`/?modal-update-service-worker=update`);
    cy.url().should("match", /\/my-workspace\/datasets/);
  });
});
