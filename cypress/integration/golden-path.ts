import imageSampleCollection from "../../typescript/web/src/utils/image-sample-collection";

describe("Golden path", () => {
  it("Should execute the golden path without errors", () => {
    cy.setCookie("hasUserTriedApp", "false");
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    // cy.visit("/");
    // cy.contains("Try it now").click();
    cy.visit("/local/datasets?modal-update-service-worker=update");
    cy.contains("Get started").click();
    cy.url().should(
      "match",
      /\/local\/datasets\/tutorial-dataset\/images\/2bbbf664-5810-4760-a10f-841de2f35510/
    );

    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get("a").contains("Datasets").click();

    cy.contains("Create new dataset...").click();
    cy.get("input").type("cypress test dataset");
    cy.contains("Start Labelling").click();

    cy.contains("cypress test dataset").click();

    cy.contains("You don't have any images.").should("be.visible");

    cy.get("header").within(() => {
      cy.contains("Add images").click();
    });
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(imageSampleCollection.slice(0, 8).join("\n"), {
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
      cy.contains(
        imageSampleCollection[0]
          .split("?")[0]
          .split("https://images.unsplash.com/")[1]
      ).should("exist");
    });
    cy.get('[aria-label="loading indicator"]').should("not.exist");

    cy.get('[aria-label="Drawing box tool"]').click();
    cy.get("main").click(450, 100);
    cy.get("main").click(500, 150);

    cy.url().should("include", "selected-label-id");
    cy.get("body").type("{del}");
    cy.url().should("not.include", "selected-label-id");

    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.get('[name="class-selection-search"]').click();
      cy.get('[name="class-selection-search"]').should("be.focused");
    });
    cy.focused().type("A new class{enter}");

    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("A new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.get("main").type("{esc}");

    cy.get('[aria-label="Class selection menu popover"]').should(
      "not.be.visible"
    );

    cy.get("main").click(450, 160);
    cy.get("main").click(500, 260);

    cy.get('[aria-label="Selection tool"]').click();

    cy.get("main").rightclick(475, 200);
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').type("My new class{enter}");
    });

    cy.get('[aria-label="Next image"]').click();

    cy.get('[aria-label="Undo tool"]').should("be.disabled");
    cy.url().should("not.include", "selected-label-id");

    cy.get("main nav").scrollTo("right");
    cy.get("main nav").within(() => {
      cy.contains("8").closest("a").click();
    });

    cy.get('input[name="current-image"]').should("have.value", "8");

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
    cy.contains("Your dataset contains 8 images and 1 labels").should(
      "be.visible"
    );
    cy.contains("Export to COCO").should("exist").click();
    cy.contains("Export Options").should("be.visible");
  });
});
