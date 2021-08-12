describe.skip("Example tests", () => {
  it('finds the content "Hello world"', () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      "http://localhost:3000/projects?modal-welcome=closed&modal-update-service-worker=update"
    );

    cy.contains(/Create an empty project/i);

    /*
     * We need to wait otherwise the test is too short and it creates bugs with the service worker.
     * We need to investigate this issue further.
     */
    cy.wait(10000);
  });
});
