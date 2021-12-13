export const declarePolygonDrawingTests = ({
  workspaceSlug,
  getDatasetSlug,
  getImageId,
}: {
  workspaceSlug: string;
  getDatasetSlug: () => string;
  getImageId: () => string;
}) => {
  it("switches between drawing tools", () => {
    const datasetSlug = getDatasetSlug();
    const imageId = getImageId();
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${workspaceSlug}/datasets/${datasetSlug}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Drawing polygon tool"]').should("not.exist");
    cy.get('[aria-label="Drawing box tool"]').should("exist").click();

    cy.wait(420);
    cy.get('[aria-label="Change Drawing tool"]').click();
    cy.get('[aria-label="Bounding box tool"]').should(
      "have.attr",
      "aria-checked",
      "true"
    );

    cy.wait(420);
    cy.get('[aria-label="Polygon tool"]')
      .should("have.attr", "aria-checked", "false")
      .click();

    cy.get('[aria-label="Drawing polygon tool"]').should("exist");
    cy.get('[aria-label="Drawing box tool"]').should("not.exist");
  });

  it("draws a polygon", () => {
    const datasetSlug = getDatasetSlug();
    const imageId = getImageId();
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${workspaceSlug}/datasets/${datasetSlug}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Change Drawing tool"]').should("exist").click();
    cy.get('[aria-label="Polygon tool"]').click();

    cy.wait(420);
    cy.get("main").click(475, 75);
    cy.get("main").click(450, 100);
    cy.get("main").click(450, 200);
    cy.get("main").click(425, 240);
    cy.get("main").click(450, 260);
    cy.get("main").click(475, 220);
    cy.get("main").click(500, 260);
    cy.get("main").click(525, 240);
    cy.get("main").click(500, 200);
    cy.get("main").dblclick(500, 100);

    cy.wait(420);
    cy.get("main").rightclick(475, 100);
    cy.get('[aria-label="Class selection popover"]')
      .contains("Rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "false")
      .click();

    cy.wait(420);
    cy.get("main").rightclick(475, 100);
    cy.get('[aria-label="Class selection popover"]')
      .contains("Rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
  });
};
