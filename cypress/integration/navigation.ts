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

  it("should clear the undo redo store between images", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit("http://localhost:3000/images?modal-welcome-disable");
    cy.contains("Add images").click();
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(
      "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80\nhttps://images.unsplash.com/photo-1504710685809-7bb702595f8f?auto=format&fit=crop&w=934&q=80"
    );
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.contains("photo").click();
    cy.get('[aria-label="Drawing tool"]', { timeout: 15000 }).click();
    cy.get("main").click(200, 200);
    cy.get("main").click(300, 300);
    cy.get('[aria-label="Next image"]').click();

    cy.get('[aria-label="Undo tool"]').should("be.disabled");
  });
});
