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

  it("Should execute the golden path without errors", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit("http://localhost:3000/images?modal-welcome=closed&modal-update-service-worker=update");
    cy.contains("You don't have any images.").should("be.visible");
    cy.get("header").within(() => {
      cy.contains("Add images").click();
    });
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(
      "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80\nhttps://images.unsplash.com/photo-1504710685809-7bb702595f8f?auto=format&fit=crop&w=934&q=80"
    );
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.contains("photo").click();
    cy.get('[aria-label="Drawing tool"]', { timeout: 30000 }).click();
    // 1. Create one bounding box
    cy.get("main").click(400, 100);
    cy.get("main").click(600, 200);

    cy.get('[aria-label="Selection tool"]').click();
    // 2. Create new class
    cy.get("main").rightclick(500, 150);
    cy.focused().type("My new class{enter}");
    cy.get("main").rightclick(500, 150);
    cy.contains("My new class").closest('[role="option"]').should("have.attr","aria-current","true");
    // 3. Assign label to class None
    cy.contains("None").click();
    cy.get("main").rightclick(500, 150);
    cy.contains("None").closest('[role="option"]').should("have.attr","aria-current","true");
    // 4. Undo label class assignment
    cy.get('[aria-label="Undo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.contains("My new class").closest('[role="option"]').should("have.attr","aria-current","true");
    // 5. Redo label class assignment
    cy.get("main").click(350, 50);
    cy.get('[aria-label="Redo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.contains("None").closest('[role="option"]').should("have.attr","aria-current","true");
    // 6. Assign label to class My new class
    cy.contains("My new class").click();
    cy.get("main").rightclick(500, 150);
    cy.contains("My new class").closest('[role="option"]').should("have.attr","aria-current","true");
    cy.get('[aria-label="Next image"]').click();
    cy.get('[aria-label="Undo tool"]').should("be.disabled");
  });
});
