import { db } from "../../typescript/web-app/src/connectors/database";
import imageSampleCollection from "../../typescript/web-app/src/utils/image-sample-collection";

describe("Golden path", () => {
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

    cy.visit("/images?modal-welcome=closed&modal-update-service-worker=update");

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
    cy.get("main")
      .contains(
        imageSampleCollection[0]
          .split("?")[0]
          .split("https://images.unsplash.com/")[1]
      )
      .click();

    cy.url().should("match", /.*\/images\/([a-zA-Z0-9_-]*)/);
    cy.get("header").within(() => {
      cy.contains("photo-").should("exist");
    });

    cy.get('[aria-label="loading indicator"]').should("not.exist");

    cy.get('[aria-label="Drawing tool"]').click();

    cy.get("main").click(450, 100);
    cy.get("main").click(500, 150);

    cy.log("Create new label class");
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").click();
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").should("be.focused");
    });
    cy.focused().type("A new class{enter}");

    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("A new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.get("main").click(450, 160);
    cy.get("main").click(500, 170);

    cy.get('[aria-label="Selection tool"]').click();

    cy.get("main").rightclick(500, 150);

    cy.get('[aria-label="Class selection popover"]').within(() => {
      // @ts-ignore
      cy.getByLabel("Search in class selection popover").type(
        "My new class{enter}"
      );
    });

    cy.log("Image navigation");
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

    cy.contains(
      imageSampleCollection[6]
        .split("?")[0]
        .split("https://images.unsplash.com/")[1]
    ).should("exist");

    cy.get('[aria-label="Export"]').click();
    cy.contains("Your project contains 2 labels").should("be.visible");
  });
});
