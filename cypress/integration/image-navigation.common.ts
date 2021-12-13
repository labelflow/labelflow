import imageSampleCollection from "../../typescript/web/src/utils/image-sample-collection";

export const declareImageNavigationTests = ({
  getDatasetSlug,
  workspaceSlug,
}: {
  getDatasetSlug: () => string;
  workspaceSlug: string;
}) => {
  it("Should let the user navigate within the image gallery", () => {
    const datasetSlug = getDatasetSlug();
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${workspaceSlug}/datasets/${datasetSlug}/images?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.contains("You don't have any images.").should("be.visible");
    cy.wait(420);
    cy.get("header").within(() => {
      cy.contains("Add images").click();
    });
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(imageSampleCollection.slice(0, 8).join("\n"), {
      delay: 0,
    });
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.get("main").contains("photo").click({ force: true });

    // Check that we can reach the end of the list
    cy.get("main nav").scrollTo("right");
    cy.get("main nav").within(() => {
      cy.contains("8").closest("a").click();
    });
    cy.get('input[name="current-image"]').should("have.value", "8");

    // Check that we can navigate to the middle of the list
    cy.get('input[name="current-image"]').type("4{enter}");
    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("4");
    });

    // check that the gallery is centered on the correct image after a reload
    cy.reload();
    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("4");
    });
  });
};
