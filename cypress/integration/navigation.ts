import { db } from "../../typescript/web-app/src/connectors/database";
import imageSampleCollection from "../../typescript/web-app/src/utils/image-sample-collection";

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
    cy.get("textarea").type(imageSampleCollection.slice(0, 15).join("\n"), {
      delay: 0,
    });
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.get("main").contains("photo").click();

    // We need to pick the drawing tool in order to see the class selection picker
    cy.get('[aria-label="Drawing tool"]').click();

    // Create new label class
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should("be.focused");
    });

    cy.focused().type("A new class{enter}");
    // Assert it is selected
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("A new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    // 1. Create one bounding box
    cy.get("main").click(400, 100);
    cy.get("main").click(600, 200);
    cy.get('[aria-label="Selection tool"]').click();

    // ############## Right click popover tests ##############
    // Create new class
    cy.get("main").rightclick(500, 150);
    cy.focused().type("My new class{enter}");
    cy.get("main").rightclick(500, 150);

    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Check that this new class is set as the label class ID in drawing mode
    cy.get('[aria-label="Drawing tool"]').click();
    cy.contains("My new class").should("be.visible");
    cy.get('[aria-label="Selection tool"]').click();
    // Assign label to class None
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]').contains("None").click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Undo label class assignment
    cy.get('[aria-label="Undo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Redo label class assignment
    cy.get("main").click(350, 50);
    cy.get('[aria-label="Redo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Assign label to class My new class
    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    // ############## Class selection menu tests ##############
    // Create new class and assign it to label
    cy.get('[aria-label="Open class selection popover"]').click();

    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should("be.focused");
    });

    cy.focused().type("My other new class{enter}");
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection popover"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Check that this new class is set as the label class ID in drawing mode
    cy.get('[aria-label="Drawing tool"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.contains("My other new class").should("be.visible");
    });
    cy.get('[aria-label="Selection tool"]').click();
    // Assign label to class None
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Undo label class assignment
    cy.get('[aria-label="Undo tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    //  Redo label class assignment
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Redo tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    //  Assign label to class My other new class
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My other new class")
      .click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Create a new label with a different label class selected in drawing mode
    cy.get('[aria-label="Drawing tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My new class")
      .click();
    cy.get("main").click(400, 300);
    cy.get("main").click(600, 400);
    cy.get('[aria-label="Selection tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').contains(
      "My new class"
    );
    // Image navigation
    cy.get('[aria-label="Next image"]').click();
    cy.get('[aria-label="Undo tool"]').should("be.disabled");
    cy.url().should("not.include", "selected-label-id");

    cy.get("main nav").scrollTo("right");
    cy.get("main nav").within(() => {
      cy.contains("15").closest("a").click();
    });

    cy.get('input[name="current-image"]').should("have.value", "15");
    cy.get('input[name="current-image"]').type("7{enter}");

    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("7");
    });
  });
});
