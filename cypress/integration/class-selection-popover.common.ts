import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { createLabelClass } from "./graphql-definitions.common";

type TestInput = {
  client: ApolloClient<NormalizedCacheObject>;
  workspaceSlug: string;
  getDatasetId: () => string;
  getDatasetSlug: () => string;
  getImageId: () => string;
};

export const declareTests = ({
  client,
  workspaceSlug,
  getDatasetId,
  getDatasetSlug,
  getImageId,
}: TestInput) => {
  it("right clicks on a label to change its class", () => {
    const datasetSlug = getDatasetSlug();
    const imageId = getImageId();
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${workspaceSlug}/datasets/${datasetSlug}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
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
    const datasetId = getDatasetId();
    const datasetSlug = getDatasetSlug();
    const imageId = getImageId();
    cy.wrap(
      createLabelClass({
        name: "My new class",
        color: "#65A30D",
        datasetId,
        client,
      })
    );

    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${workspaceSlug}/datasets/${datasetSlug}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
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
    const datasetId = getDatasetId();
    const datasetSlug = getDatasetSlug();
    const imageId = getImageId();
    cy.wrap(
      createLabelClass({
        name: "My new class",
        color: "#65A30D",
        datasetId,
        client,
      })
    );
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${workspaceSlug}/datasets/${datasetSlug}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
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
    const datasetSlug = getDatasetSlug();
    const imageId = getImageId();
    cy.visit(
      `/${workspaceSlug}/datasets/${datasetSlug}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );

    cy.wait(420);
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Navigate in hidden breadcrumbs"]').click();
    cy.contains("cypress test dataset").click({ force: true });

    cy.wait(420);
    cy.contains("classes").click();
    cy.url().should(
      "contain",
      `/${workspaceSlug}/datasets/${datasetSlug}/classes`
    );

    cy.wait(420);
    cy.contains("A new class");
    cy.get('[aria-label="Delete class"]').click();

    cy.wait(420);
    cy.get('[aria-label="Confirm deleting class"]').click();
    cy.contains("A new class").should("not.exist");
    cy.contains(/^images$/).click();
    cy.get("main").contains("photo-1579513141590-c597876aefbc").click();

    cy.wait(420);
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();

    cy.wait(420);
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("A new class")
      .should("not.exist");
  });
};
