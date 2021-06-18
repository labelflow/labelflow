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
    cy.visit(
      "http://localhost:3000/images?modal-welcome=closed&modal-update-service-worker=update"
    );
    cy.contains("You don't have any images.").should("be.visible");
    cy.get("header").within(() => {
      cy.contains("Add images").click();
    });
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(
      "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80\nhttps://images.unsplash.com/photo-1504710685809-7bb702595f8f?auto=format&fit=crop&w=934&q=80\nhttps://images.unsplash.com/photo-1569579933032-9e16447c50e3?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1595687453172-253f44ed3975?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1574082595167-86d59cefcc3a?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1504618223053-559bdef9dd5a?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1490718720478-364a07a997cd?auto=format&fit=crop&w=933&q=80\nhttps://images.unsplash.com/photo-1557054068-bf70b5f32470?auto=format&fit=crop&w=2098&q=80\nhttps://images.unsplash.com/photo-1580629905303-faaa03202631?auto=format&fit=crop&w=1001&q=80\nhttps://images.unsplash.com/photo-1562519990-50eb51e282b2?auto=format&fit=crop&w=2089&q=80\nhttps://images.unsplash.com/photo-1565085360602-de694f1d7650?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1594389615321-4f50c5d7878c?auto=format&fit=crop&w=2100&q=80\nhttps://images.unsplash.com/photo-1548613053-22087dd8edb8?auto=format&fit=crop&w=975&q=80\nhttps://images.unsplash.com/photo-1567672935596-057a100fcced?auto=format&fit=crop&w=933&q=80\nhttps://images.unsplash.com/photo-1540380403593-2f4cbbc006dd?auto=format&fit=crop&w=934&q=80",
      { delay: 0 }
    );
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.contains("photo").click();
    cy.get('[aria-label="Drawing tool"]', { timeout: 30000 }).click();
    // Create one bb
    cy.get("main").click(400, 100);
    cy.get("main").click(600, 200);

    cy.get('[aria-label="Selection tool"]').click();
    // Create new class
    cy.get("main").rightclick(500, 150);
    cy.focused().type("My new class{enter}");
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`)
      .contains("My new class")
      .should("be.visible");
    // Assign label to class None
    cy.contains("None").click();
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`).contains("None").should("be.visible");
    // Undo label class assignment
    cy.get('[aria-label="Undo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`)
      .contains("My new class")
      .should("be.visible");
    // Redo label class assignment
    cy.get("main").click(350, 50);
    cy.get('[aria-label="Redo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`).contains("None").should("be.visible");
    // Assign label to class My new class
    cy.contains("My new class").click();
    cy.get("main").rightclick(500, 150);
    cy.get(`[aria-current="true"]`)
      .contains("My new class")
      .should("be.visible");
    cy.get('[aria-label="Next image"]').click();
    cy.get('[aria-label="Undo tool"]').should("be.disabled");

    cy.get("main nav").within(() => {
      cy.get("> *:first-child").scrollTo("right");
      cy.contains("15").closest("a").click();
    });

    cy.get('input[name="current-image"]').should("have.value", "15");
    cy.get('input[name="current-image"]').type("7{enter}");

    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("7");
    });
  });
});
