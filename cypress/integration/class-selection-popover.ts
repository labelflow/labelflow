import gql from "graphql-tag";

import { db } from "../../typescript/web-app/src/connectors/database";
import { client } from "../../typescript/web-app/src/connectors/apollo-client-schema";

async function createImage(url: string) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($url: String) {
        createImage(data: { url: $url }) {
          id
          name
          width
          height
          url
        }
      }
    `,
    variables: {
      url,
    },
  });

  const {
    data: { createImage: image },
  } = mutationResult;

  return image;
}

describe("Class selection popover", () => {
  let imageId: string;
  beforeEach(async () => {
    await Promise.all([
      db.image.clear(),
      db.label.clear(),
      db.labelClass.clear(),
      db.file.clear(),
    ]);

    const { id } = await createImage(
      "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80"
    );

    imageId = id;
  });

  it("Should work", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="Drawing tool"]').click();

    // Create new label class
    cy.log("Create new label class");
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should(
        "not.be.focused"
      );
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").click();
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should("be.focused");
    });

    cy.focused().type("A new class{enter}");
    // Assert it is selected
    cy.log("Assert it is selected");
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("A new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    // 1. Create one bounding box
    cy.log("Create one bounding box");
    cy.get("main").click(400, 100);
    cy.get("main").click(600, 200);
    cy.get('[aria-label="Selection tool"]').click();

    // ############## Right click popover tests ##############
    // Create new class
    cy.log("Create new class");
    cy.get("main").rightclick(500, 150);

    cy.get('[aria-label="Class selection popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").type(
        "My new class{enter}"
      );
    });
    cy.get("main").rightclick(500, 150);

    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Check that this new class is set as the label class ID in drawing mode
    cy.log(
      "Check that this new class is set as the label class ID in drawing mode"
    );
    cy.get('[aria-label="Drawing tool"]').click();
    cy.contains("My new class").should("be.visible");
    cy.get('[aria-label="Selection tool"]').click();
    // Assign label to class None
    cy.log("Assign label to class None");
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]').contains("None").click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Undo label class assignment
    cy.log("Undo label class assignment");
    cy.get('[aria-label="Undo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Redo label class assignment
    cy.log("Redo label class assignment");
    cy.get("main").click(350, 50);
    cy.get('[aria-label="Redo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Assign label to class My new class
    cy.log("Assign label to class My new class");
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
    cy.log("Create new class and assign it to label");
    cy.get('[aria-label="Open class selection popover"]').click();

    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should(
        "not.be.focused"
      );
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").click();
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
    cy.log(
      "Check that this new class is set as the label class ID in drawing mode"
    );
    cy.get('[aria-label="Drawing tool"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.contains("My other new class").should("be.visible");
    });
    cy.get('[aria-label="Selection tool"]').click();
    // Assign label to class None
    cy.log("Assign label to class None");
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
    cy.log("Undo label class assignment");
    cy.get('[aria-label="Undo tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Redo label class assignment
    cy.log("Redo label class assignment");
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Redo tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Assign label to class My other new class
    cy.log("Assign label to class My other new class");
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My other new class")
      .click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    // Create a new label with a different label class selected in drawing mode
    cy.log(
      "Create a new label with a different label class selected in drawing mode"
    );
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
    // ############## Class selection with shortcut ##############
    // A class can be selected by shortcut from the right click popover
    cy.log("A class can be selected by shortcut from the right click popover");
    cy.get("main").rightclick(500, 150);
    cy.focused().type("2");
    cy.get('[aria-label="Open class selection popover"]').contains(
      "My other new class"
    );
    // A class can be selected by shortcut when a label is selected
    cy.log("A class can be selected by shortcut when a label is selected");
    cy.get("main").click(500, 150);
    cy.get('[aria-label="Open class selection popover"]').type("1");
    cy.get('[aria-label="Open class selection popover"]').contains(
      "My new class"
    );
    // Shortcut for focusing the search input works in the right click popover
    cy.log(
      "Shortcut for focusing the search input works in the right click popover"
    );
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .should("be.visible")
      .and("be.focused");
    // cy.get("body").type("/");

    cy.get('[aria-label="Class selection popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should(
        "not.be.focused"
      );
    });
    // // @ts-ignore
    // cy.getByLabel("Search in class selection popover").click();
    cy.focused().type("/");
    cy.get('[aria-label="Class selection popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should("be.focused");
    });
    // Shortcut for focusing the search input works in the class selection menu popover
    cy.log(
      "Shortcut for focusing the search input works in the class selection menu popover"
    );
    cy.get("main").click(500, 150);
    cy.get('[aria-label="Class selection menu popover"]').should(
      "not.be.visible"
    );
    cy.get('[aria-label="Open class selection popover"]').click();

    cy.get('[aria-label="Class selection menu popover"]').should("be.visible");

    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should(
        "not.be.focused"
      );
    });

    cy.focused().type("/");

    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should("be.focused");
    });
  });
});
