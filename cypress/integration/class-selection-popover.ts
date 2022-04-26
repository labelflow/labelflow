import { LabelType } from "../../typescript/graphql-types";
import { DATASET_NAME, DATASET_SLUG, WORKSPACE_SLUG } from "../fixtures";
import { createImage, createLabel, createLabelClass } from "../utils/graphql";

describe("Class selection popover", () => {
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
      const { id: labelClassId } = await createLabelClass({
        name: "A new class",
        color: "#F87171",
        datasetId,
      });
      await createLabel({
        data: {
          imageId,
          labelClassId,
          type: LabelType.Box,
          geometry: {
            type: LabelType.Polygon,
            coordinates: [
              [
                [0, 900],
                [900, 900],
                [900, 1500],
                [0, 1500],
                [0, 900],
              ],
            ],
          },
        },
      });
    });
  });

  it("right clicks on a label to change its class", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images/${imageId}?modal-welcome=closed`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();

    cy.wait(420);
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').type("My new class{enter}");
    });

    cy.wait(420);
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.wait(420);
    cy.get('[aria-label="Drawing box tool"]').click();
    cy.contains("My new class").should("be.visible");

    cy.wait(420);
    cy.get('[aria-label="Selection tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]').contains("None").click();

    cy.wait(420);
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.wait(420);
    cy.get('[aria-label="Undo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.wait(420);
    cy.get("main").click(350, 100);
    cy.get('[aria-label="Redo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
  });

  it("uses the class selection menu to change the class of created labels", () => {
    cy.wrap(
      createLabelClass({
        name: "My new class",
        color: "#65A30D",
        datasetId,
      })
    );

    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images/${imageId}?modal-welcome=closed`
    );

    cy.wait(420);
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();

    cy.wait(420);
    cy.get("main").click(500, 150);
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("not.be.focused");
      cy.get('[name="class-selection-search"]').click();
      cy.get('[name="class-selection-search"]').should("be.focused");
    });
    cy.focused().type("My other new class{enter}");

    cy.wait(420);
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.contains("My other new class")
        .closest('[role="option"]')
        .should("have.attr", "aria-current", "true");
    });

    cy.wait(420);
    cy.get('[aria-label="Drawing box tool"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.contains("My other new class").should("be.visible");
    });

    cy.wait(420);
    cy.get('[aria-label="Selection tool"]').click();
    cy.get("main").click(500, 150);
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .click();

    cy.wait(420);
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.wait(420);
    cy.get('[aria-label="Undo tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.wait(420);
    cy.get('[aria-label="Redo tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.wait(420);
    cy.get('[aria-label="Drawing box tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My new class")
      .click();
    cy.get('[aria-label="Class selection menu popover"]').should(
      "not.be.visible"
    );

    cy.get("main").click(400, 300);
    cy.get("main").click(600, 400);

    cy.wait(420);
    cy.get('[aria-label="Selection tool"]').click();
    cy.get("main").click(450, 350);
    cy.get('[aria-label="Open class selection popover"]')
      .contains("My new class")
      .should("be.visible");
  });

  it("uses shortcuts to change classes", () => {
    cy.wrap(
      createLabelClass({
        name: "My new class",
        color: "#65A30D",
        datasetId,
      })
    );
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images/${imageId}?modal-welcome=closed`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();

    cy.wait(420);
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .should("be.visible")
      .and("be.focused");
    cy.focused().type("2");
    cy.get('[aria-label="Open class selection popover"]').contains(
      "My new class"
    );

    cy.wait(420);
    cy.get('[aria-label="Open class selection popover"]').type("1");
    cy.get('[aria-label="Open class selection popover"]').contains(
      "A new class"
    );

    cy.wait(420);
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .should("be.visible")
      .and("be.focused");
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("not.be.focused");
    });

    cy.wait(420);
    cy.focused().trigger("keydown", {
      key: "/",
      code: "Slash",
      keyCode: "191",
    });

    cy.wait(420);
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("be.focused");
    });

    cy.wait(420);
    cy.get("main").click(500, 150);
    cy.get('[aria-label="Class selection menu popover"]').should(
      "not.be.visible"
    );
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').should("be.visible");
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("not.be.focused");
    });

    cy.wait(420);
    cy.focused().trigger("keydown", {
      key: "/",
      code: "Slash",
      keyCode: "191",
    });

    cy.wait(420);
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("be.focused");
    });
  });

  it("should update the label classes list when a label class is deleted", () => {
    cy.visit(
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images/${imageId}?modal-welcome=closed`
    );

    cy.wait(420);
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Navigate in hidden breadcrumbs"]').click();
    cy.contains(DATASET_NAME).click({ force: true });

    cy.wait(420);
    cy.contains("classes").click();
    cy.url().should(
      "contain",
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/classes`
    );

    cy.wait(420);
    cy.contains("A new class");
    cy.get('[aria-label="Delete class"]').click();

    cy.wait(420);
    cy.get('[aria-label="Confirm delete label class"]').click();
    cy.contains("A new class").should("not.exist");
    cy.contains(/^images$/).click();
    cy.get(
      '[data-testid="image-card-photo-1579513141590-c597876aefbc"]'
    ).click();

    cy.wait(420);
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();

    cy.wait(420);
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("A new class")
      .should("not.exist");
  });
});
