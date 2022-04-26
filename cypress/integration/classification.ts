import { DATASET_SLUG, WORKSPACE_SLUG } from "../fixtures";
import { createImage, createLabelClass } from "../utils/graphql";

describe("Classification (online)", () => {
  let datasetId: string;
  let imageId: string;

  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets").then(async (createResult: any) => {
      datasetId = createResult.datasetId;

      const { id } = await createImage({
        url: "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        datasetId,
      });
      imageId = id;

      await createLabelClass({ name: "Rocket", color: "#F87171", datasetId });
    });
  });

  it("switches between drawing tools", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images/${imageId}?modal-welcome=closed`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Drawing classification tool"]').should("not.exist");
    cy.get('[aria-label="Drawing box tool"]').should("exist").click();
    cy.get('[aria-label="Change Drawing tool"]').click();
    cy.get('[data-testid="box-tool-item"]').should(
      "have.attr",
      "aria-checked",
      "true"
    );
    cy.get('[data-testid="classification-tool-item"]')
      .should("have.attr", "aria-checked", "false")
      .click();

    cy.get('[aria-label="Drawing classification tool"]').should("exist");
    cy.get('[aria-label="Drawing box tool"]').should("not.exist");
  });

  it("add classes and remove them", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images/${imageId}?modal-welcome=closed`
    );

    // Switch to classification tool
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Change Drawing tool"]').should("exist").click();
    cy.get('[data-testid="classification-tool-item"]').click();

    // Create a classification tag with the existing class "rocket"
    cy.wait(420);
    cy.get("main").rightclick(475, 100);
    cy.wait(420);
    cy.get('[aria-label="Class selection popover"]')
      .contains("Rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "false")
      .click();

    // Create a classification tag by creating a new class "My new class"
    cy.wait(420);
    cy.get("main").rightclick(100, 100);
    cy.wait(420);
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').click();
      cy.wait(420);
      cy.get('[name="class-selection-search"]').type("My new class{enter}");
    });

    // Remove label using dustbin button in option toolbar
    cy.wait(420);
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "be.visible"
    );
    cy.get('[aria-label="Delete selected label"]').click();
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "not.exist"
    );

    // Remove label by clicking close button of tag
    cy.wait(420);
    cy.get('[aria-label="Classification tag: Rocket"]').should("be.visible");
    cy.get('[aria-label="Classification tag: Rocket"]')
      .get('[aria-label="close"]')
      .click();
    cy.get('[aria-label="Classification tag: Rocket"]').should("not.exist");

    // Add a label with the add menu
    cy.wait(420);
    cy.get('[aria-label="Classification tag: Rocket"]').should("not.exist");
    cy.get('[aria-label="Add a label"]').click();
    cy.get('[aria-label="Class addition menu popover"]')
      .contains("Rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "false")
      .click();
    cy.get('[aria-label="Classification tag: Rocket"]').should("be.visible");

    // Add a label with key shortcut
    cy.wait(420);
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "not.exist"
    );
    cy.get('[aria-label="Add a label"]').click();
    cy.get("body").type("2");
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "be.visible"
    );

    // Switch to selection mode
    cy.wait(420);
    cy.get("body").type("v");

    // Edit a label to another class of an existing label, should merge
    cy.wait(420);
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "be.visible"
    );
    cy.get('[aria-label="Classification tag: My new class"]').rightclick();
    cy.wait(420);
    cy.get("body").type("1");
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "not.exist"
    );

    // Switch to classification mode
    cy.wait(420);
    cy.get("body").type("k");

    // Remove last label with keyboard shortcut of addition
    cy.wait(420);
    cy.get('[aria-label="Classification tag: Rocket"]').should("be.visible");
    cy.get("body").type("1");
    cy.get('[aria-label="Classification tag: Rocket"]').should("not.exist");

    // Open the context menu with "C"
    cy.wait(420);
    cy.get("body").type("c");

    // Apply class by partially typing in the context menu and pressing enter
    cy.wait(420);
    cy.get('[aria-label="Classification tag:  My new class"]').should(
      "not.exist"
    );
    cy.get("body").type("c");
    cy.get("body").type("/");
    cy.get("body").type("My new{enter}");

    // Press "D" to deselect
    cy.wait(420);
    cy.get("body").type("d");
    // cy.get('[aria-label="Classification tag:  My new class"]').should(
    //   "be.visible"
    // );

    // Open the context menu with "C"
    cy.wait(420);
    cy.get("body").type("c");

    // Remove class by partially typing in the context menu and pressing enter
    cy.wait(420);
    // cy.get('[aria-label="Classification tag:  My new class"]').should(
    //   "be.visible"
    // );
    cy.get("body").type("c");
    cy.get("body").type("/");
    cy.get("body").type("My new{enter}");

    // Press "D" to deselect
    cy.wait(420);
    cy.get("body").type("d");
    cy.get('[aria-label="Classification tag:  My new class"]').should(
      "not.exist"
    );

    // Open the context menu with "C" and set a class by using shortcut
    cy.wait(420);
    cy.get('[aria-label="Classification tag: Rocket"]').should("not.exist");
    cy.get("body").type("c");
    cy.focused().type("1");
    cy.get('[aria-label="Classification tag: Rocket"]').should("be.visible");

    // Open the context menu with "C" and remove a class by using shortcut
    cy.wait(420);
    cy.get('[aria-label="Classification tag: Rocket"]').should("be.visible");
    cy.get("body").type("c");
    cy.focused().type("1");
    cy.get('[aria-label="Classification tag: Rocket"]').should("not.exist");
  });
});
