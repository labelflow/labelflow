import gql from "graphql-tag";

import { client } from "../../typescript/web-app/src/connectors/apollo-client-schema";
import { LabelCreateInput } from "../../typescript/web-app/src/graphql-types.generated";

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

const createLabel = (data: LabelCreateInput) => {
  return client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput!) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data,
    },
  });
};

const createLabelClass = async (name: String, color = "#ffffff") => {
  const {
    data: {
      createLabelClass: { id },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createLabelClass($name: String!, $color: String!) {
        createLabelClass(data: { name: $name, color: $color }) {
          id
          name
          color
        }
      }
    `,
    variables: {
      name,
      color,
    },
  });

  return id;
};

describe("Class selection popover", () => {
  let imageId: string;
  beforeEach(() =>
    cy.window().then(async () => {
      console.log("Create data");
      const { id } = await createImage(
        "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80"
      );
      imageId = id;

      const labelClassId = await createLabelClass("A new class", "#F87171");
      await createLabel({
        imageId,
        x: 0,
        y: 900,
        width: 900,
        height: 600,
        labelClassId,
      });
    })
  );

  it("right clicks on a label to change its class", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();

    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').type("My new class{enter}");
    });

    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.get('[aria-label="Drawing tool"]').click();
    cy.contains("My new class").should("be.visible");

    cy.get('[aria-label="Selection tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]').contains("None").click();

    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.get('[aria-label="Undo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("My new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.get("main").click(350, 50);
    cy.get('[aria-label="Redo tool"]').click();
    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
  });

  it("uses the class selection menu to change the class of created labels", () => {
    cy.wrap(createLabelClass("My new class", "#65A30D"));

    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();

    cy.get("main").click(500, 150);
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("not.be.focused");
      cy.get('[name="class-selection-search"]').click();
      cy.get('[name="class-selection-search"]').should("be.focused");
    });
    cy.focused().type("My other new class{enter}");

    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection popover"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.get('[aria-label="Drawing tool"]').click();
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.contains("My other new class").should("be.visible");
    });

    cy.get('[aria-label="Selection tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .click();

    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.get('[aria-label="Undo tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My other new class")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.get('[aria-label="Redo tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("None")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");

    cy.get('[aria-label="Drawing tool"]').click();
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]')
      .contains("My new class")
      .click();
    cy.get('[aria-label="Class selection menu popover"]').should(
      "not.be.visible"
    );

    cy.get("main").click(400, 300);
    cy.get("main").click(600, 400);

    cy.get('[aria-label="Selection tool"]').click();
    cy.get("main").click(450, 350);
    cy.get('[aria-label="Open class selection popover"]')
      .contains("My new class")
      .should("be.visible");
  });

  it("uses shortcuts to change classes", () => {
    cy.wrap(createLabelClass("My new class", "#65A30D"));
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();

    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .should("be.visible")
      .and("be.focused");
    cy.focused().type("2");
    cy.get('[aria-label="Open class selection popover"]').contains(
      "My new class"
    );

    cy.get('[aria-label="Open class selection popover"]').type("1");
    cy.get('[aria-label="Open class selection popover"]').contains(
      "A new class"
    );

    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .should("be.visible")
      .and("be.focused");
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("not.be.focused");
    });

    cy.focused().trigger("keydown", {
      key: "/",
      code: "Slash",
      keyCode: "191",
    });

    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("be.focused");
    });

    cy.get("main").click(500, 150);
    cy.get('[aria-label="Class selection menu popover"]').should(
      "not.be.visible"
    );
    cy.get('[aria-label="Open class selection popover"]').click();
    cy.get('[aria-label="Class selection menu popover"]').should("be.visible");
    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("not.be.focused");
    });

    cy.focused().trigger("keydown", {
      key: "/",
      code: "Slash",
      keyCode: "191",
    });

    cy.get('[aria-label="Class selection menu popover"]').within(() => {
      cy.get('[name="class-selection-search"]').should("be.focused");
    });
  });
});
