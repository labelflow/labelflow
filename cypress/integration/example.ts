describe("Example tests", () => {
  it('finds the content "Hello world"', () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit("http://localhost:3000/images?modal-welcome-disable");

    cy.contains("Add images");
  });
});
