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
    // Create one bb
    cy.wait(500);// Not sure why we need this, but the test randomly fails it we don't add this
    cy.get("main").click(400, 100);
    cy.get("main").click(600, 200);

    cy.get('[aria-label="Selection tool"]').click();
    // Create new class
    cy.get("main").rightclick(500, 150);
    cy.focused().type("My new class{enter}");
    cy.wait(500); // Not sure why we need this, but the test randomly fails it we don't add this
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`).contains("My new class").should("be.visible");
    // Assign label to class None
    cy.contains("None").click();
    cy.wait(500); // Not sure why we need this, but the test randomly fails it we don't add this
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`).contains("None").should("be.visible");
    // Undo label class assignment
    cy.get('[aria-label="Undo tool"]').click();
    cy.wait(500); // Not sure why we need this, but the test randomly fails it we don't add this
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`).contains("My new class").should("be.visible");
    // Redo label class assignment
    cy.get("main").click(350, 50);
    cy.get('[aria-label="Redo tool"]').click();
    cy.wait(500); // Not sure why we need this, but the test randomly fails it we don't add this
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`).contains("None").should("be.visible");
    // Assign label to class My new class
    cy.contains("My new class").click();
    cy.wait(500); // Not sure why we need this, but the test randomly fails it we don't add this
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`).contains("My new class").should("be.visible");
    cy.get('[aria-label="Next image"]').click();
    cy.get('[aria-label="Undo tool"]').should("be.disabled");
  });
});
