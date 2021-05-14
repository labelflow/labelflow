describe("Example tests", () => {
  it('finds the content "Hello world"', () => {
    cy.visit("http://localhost:3000");

    cy.contains("Hello world");
  });
});
