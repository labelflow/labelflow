describe("Dataset creation, edition, deletion", () => {
  it("Should create, rename and delete a dataset", () => {
    cy.setCookie("hasUserTriedApp", "true");
    cy.setCookie("consentedCookies", "true");
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    // cy.visit("/");
    // cy.contains("Try it now").click();
    cy.visit("http://localhost:3000/local/datasets");
    cy.contains("Create new dataset...").click();
    cy.get("input").type("cypress dataset");
    cy.contains("Start Labelling").click();
    cy.contains("cypress dataset");
    cy.contains("0 Images").should("be.visible");
    cy.contains("0 Classes").should("be.visible");
    cy.contains("0 Labels").should("be.visible");
    cy.get('[aria-label="edit dataset"]').click();
    cy.get("input").clear();
    cy.get("input").type("{selectall}{backspace}renamed cypress dataset");
    cy.contains("Update Dataset").click();
    cy.contains("renamed cypress dataset");
    cy.get('[aria-label="delete dataset"]').click();
    cy.get('[aria-label="Dataset delete"]').click();
    cy.get('[aria-label="delete dataset"]').should("not.exist");
  });
});
