import imageSampleCollection from "../../typescript/web/src/utils/image-sample-collection";
import { WORKSPACE_SLUG } from "../fixtures";

describe("Golden path (online)", () => {
  beforeEach(() => {
    // Login and create a workspace with datasets in it
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets");
  });

  it("Should execute the golden path without errors", () => {
    cy.setCookie("consentedCookies", "true");
    cy.visit(`/${WORKSPACE_SLUG}/datasets?`);
    cy.get('[aria-label="Create new dataset"]').click();
    cy.get('[aria-label="Dataset name input"]').type("cypress dataset");

    cy.wait(420);
    cy.contains("Start Labeling").click();

    cy.wait(420);
    cy.contains("cypress dataset").click();

    cy.contains("You don't have any images").should("be.visible");

    cy.wait(420);
    cy.get("header").within(() => {
      cy.contains("Add images").click();
    });
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(imageSampleCollection.slice(0, 8).join("\n"), {
      delay: 0,
    });

    cy.wait(420);
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();

    cy.wait(420);
    cy.get(
      `[data-testid="image-card-${
        imageSampleCollection[1]
          .split("?")[0]
          .split("https://images.unsplash.com/")[1]
      }"]`
    )
      .trigger("mouseover")
      .get(
        `[data-testid="select-image-checkbox-${
          imageSampleCollection[1]
            .split("?")[0]
            .split("https://images.unsplash.com/")[1]
        }"]`
      )
      .click({ force: true });

    cy.get(`[data-testid="delete-selected-images"]`).click();

    cy.get('[data-testid="confirm-delete-button"]').click();

    cy.get("main")
      .contains(
        imageSampleCollection[1]
          .split("?")[0]
          .split("https://images.unsplash.com/")[1]
      )
      .should("not.exist");

    cy.wait(420);
    cy.get(
      `[data-testid="image-card-${
        imageSampleCollection[0]
          .split("?")[0]
          .split("https://images.unsplash.com/")[1]
      }"]`
    ).click();

    cy.url().should("match", /.*\/images\/([a-zA-Z0-9_-]*)/);
    cy.get("header").within(() => {
      cy.contains(
        imageSampleCollection[0]
          .split("?")[0]
          .split("https://images.unsplash.com/")[1]
      ).should("exist");
    });
    cy.get('[aria-label="loading indicator"]').should("not.exist");

    cy.wait(420);
    cy.get('[aria-label="Drawing box tool"]').click();
    cy.get("main").click(450, 100);
    cy.get("main").click(500, 150);

    cy.wait(420);
    cy.url().should("include", "selected-label-id");
    cy.get("body").type("{del}");
    cy.url().should("not.include", "selected-label-id");

    cy.wait(420);
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.get('[name="class-selection-search"]').click();
      cy.get('[name="class-selection-search"]').should("be.focused");
    });
    cy.focused().type("A new class{enter}");

    cy.wait(420);
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("A new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.wait(420);
    cy.get("main").type("{esc}");

    cy.wait(420);
    cy.get('[aria-label="Class selection menu popover"]').should(
      "not.be.visible"
    );

    cy.wait(420);
    cy.get("main").click(450, 160);
    cy.get("main").click(500, 260);

    // Switch to classification tool
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Change Drawing tool"]').should("exist").click();
    cy.get('[aria-label="Classification tool"]').click();

    // Create a classification tag by creating a new class "My new class"
    cy.wait(420);
    cy.get("main").rightclick(475, 100);
    cy.wait(420);
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').click();
      cy.wait(420);
      cy.get('[name="class-selection-search"]').type("My new class{enter}");
    });

    // Change bounding box class, while in classification tool, by partially typing the class name
    cy.wait(420);
    cy.get("main").rightclick(475, 210);
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').click();
      cy.wait(420);
      cy.get('[name="class-selection-search"]').type("My new cl{enter}");
    });

    // Change bounding box class back, while in classification tool, by right clicking to open context menu
    cy.wait(420);
    cy.get("main").rightclick(475, 210);
    cy.wait(420);
    cy.get("main").type("1");

    // Remove classification label using dustbin button in option toolbar
    cy.wait(420);
    cy.get('[aria-label="Classification tag: My new class"]')
      .should("be.visible")
      .click();
    cy.get('[aria-label="Delete selected label"]').click();
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "not.exist"
    );

    // Move to selection tool
    cy.wait(420);
    cy.get('[aria-label="Selection tool"]').click();

    cy.wait(420);
    cy.get("main").rightclick(475, 200);
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').type("My new class{enter}");
    });

    cy.wait(420);
    cy.get('[aria-label="Next image"]').click();

    cy.wait(420);
    cy.get('[aria-label="Undo tool"]').should("be.disabled");
    cy.url().should("not.include", "selected-label-id");

    cy.wait(420);
    cy.get("main nav").scrollTo("right");
    cy.get("main nav").within(() => {
      cy.contains("7").closest("a").click();
    });

    cy.wait(420);
    cy.get('input[name="current-image"]').should("have.value", "7");
    cy.get('input[name="current-image"]').type("6{enter}");

    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("6");
    });
    cy.contains(
      imageSampleCollection[6]
        .split("?")[0]
        .split("https://images.unsplash.com/")[1]
    ).should("exist");

    cy.wait(420);
    cy.get('[aria-label="Export"]').click();
    cy.contains("Your dataset contains 7 images and 1 labels").should(
      "be.visible"
    );

    cy.wait(420);
    cy.contains("Export to COCO").should("exist").click();
    cy.contains("Export Options").should("be.visible");
  });
});
