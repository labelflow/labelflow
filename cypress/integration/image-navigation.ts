import { db } from "../../typescript/web-app/src/connectors/database";

describe("Labelling tool", () => {
  beforeEach(() => {
    return Promise.all([
      db.image.clear(),
      db.label.clear(),
      db.labelClass.clear(),
      db.file.clear(),
    ]);
  });

  it("Should let the user navigate within the image gallery", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      "http://localhost:3000/images?modal-welcome=closed&modal-update-service-worker=update"
    );
    cy.contains("You don't have any images.").should("be.visible");
    cy.get("header").within(() => {
      cy.contains("Add images").click();
    });
    cy.contains("Import from a list of URLs instead").click();
    cy.contains("Insert example images").click();
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.get("main").contains("photo").click();

    // Check that we can reach the end of the list
    cy.get("main nav").scrollTo("right");
    cy.get("main nav").within(() => {
      cy.contains("100").closest("a").click();
    });
    cy.get('input[name="current-image"]').should("have.value", "100");

    // Check that we can navigate to the middle of the list
    cy.get('input[name="current-image"]').type("50{enter}");
    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("50");
    });

    // check that the gallery is centered on the correct image after a reload
    cy.reload();
    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("50");
    });
  });
});
