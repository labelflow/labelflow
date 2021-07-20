describe("Example tests", () => {
  it('finds the content "Hello world"', () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      "http://localhost:3000/projects?modal-welcome=closed&modal-update-service-worker=update"
    );

    cy.contains("Create new project...");
  });
});
