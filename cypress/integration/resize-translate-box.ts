import gql from "graphql-tag";

import { db } from "../../typescript/web-app/src/connectors/database";
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

describe("Resize and translate box interaction", () => {
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
    await createLabel({
      imageId,
      x: 0,
      y: 900,
      width: 900,
      height: 600,
    });
  });

  it("translates the label", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();
    // Select label
    cy.get("main").click(500, 150);
    // Click and drag to translate
    cy.get("canvas")
      .trigger("pointerdown", 500, 150, { eventConstructor: "PointerEvent" })
      .trigger("pointermove", 500, 300, { eventConstructor: "PointerEvent" })
      .trigger("pointerUp", { eventConstructor: "PointerEvent" });
  });

  // it("uses the class selection menu to change the class of created labels", () => {
  //   cy.wrap(createLabelClass("My new class", "#65A30D"));

  //   // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
  //   cy.visit(
  //     `/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
  //   );
  //   cy.get('[aria-label="loading indicator"]').should("not.exist");
  //   cy.get('[aria-label="Selection tool"]').click();

  //   cy.get("main").click(500, 150);
  //   cy.get('[aria-label="Open class selection popover"]').click();
  //   cy.get('[aria-label="Class selection menu popover"]').within(() => {
  //     cy.get('[name="class-selection-search"]').should("not.be.focused");
  //     cy.get('[name="class-selection-search"]').click();
  //     cy.get('[name="class-selection-search"]').should("be.focused");
  //   });
  //   cy.focused().type("My other new class{enter}");

  //   cy.get('[aria-label="Open class selection popover"]').click();
  //   cy.get('[aria-label="Class selection popover"]')
  //     .contains("My other new class")
  //     .closest('[role="option"]')
  //     .should("have.attr", "aria-current", "true");

  //   cy.get('[aria-label="Drawing tool"]').click();
  //   cy.get('[aria-label="Class selection menu popover"]').within(() => {
  //     cy.contains("My other new class").should("be.visible");
  //   });

  //   cy.get('[aria-label="Selection tool"]').click();
  //   cy.get('[aria-label="Open class selection popover"]').click();
  //   cy.get('[aria-label="Class selection menu popover"]')
  //     .contains("None")
  //     .click();

  //   cy.get('[aria-label="Open class selection popover"]').click();
  //   cy.get('[aria-label="Class selection menu popover"]')
  //     .contains("None")
  //     .closest('[role="option"]')
  //     .should("have.attr", "aria-current", "true");

  //   cy.get('[aria-label="Undo tool"]').click();
  //   cy.get('[aria-label="Open class selection popover"]').click();
  //   cy.get('[aria-label="Class selection menu popover"]')
  //     .contains("My other new class")
  //     .closest('[role="option"]')
  //     .should("have.attr", "aria-current", "true");

  //   cy.get('[aria-label="Redo tool"]').click();
  //   cy.get('[aria-label="Open class selection popover"]').click();
  //   cy.get('[aria-label="Class selection menu popover"]')
  //     .contains("None")
  //     .closest('[role="option"]')
  //     .should("have.attr", "aria-current", "true");

  //   cy.get('[aria-label="Drawing tool"]').click();
  //   cy.get('[aria-label="Open class selection popover"]').click();
  //   cy.get('[aria-label="Class selection menu popover"]')
  //     .contains("My new class")
  //     .click();
  //   cy.get('[aria-label="Class selection menu popover"]').should(
  //     "not.be.visible"
  //   );

  //   cy.get("main").click(400, 300);
  //   cy.get("main").click(600, 400);

  //   cy.get('[aria-label="Selection tool"]').click();
  //   cy.get("main").click(450, 350);
  //   cy.get('[aria-label="Open class selection popover"]')
  //     .contains("My new class")
  //     .should("be.visible");
  // });

  // it("uses shortcuts to change classes", () => {
  //   cy.wrap(createLabelClass("My new class", "#65A30D"));
  //   // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
  //   cy.visit(
  //     `/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
  //   );
  //   cy.get('[aria-label="loading indicator"]').should("not.exist");
  //   cy.get('[aria-label="Selection tool"]').click();

  //   cy.get("main").rightclick(500, 150);
  //   cy.get('[aria-label="Class selection popover"]')
  //     .should("be.visible")
  //     .and("be.focused");
  //   cy.focused().type("2");
  //   cy.get('[aria-label="Open class selection popover"]').contains(
  //     "My new class"
  //   );

  //   cy.get('[aria-label="Open class selection popover"]').type("1");
  //   cy.get('[aria-label="Open class selection popover"]').contains(
  //     "A new class"
  //   );

  //   cy.get("main").rightclick(500, 150);
  //   cy.get('[aria-label="Class selection popover"]')
  //     .should("be.visible")
  //     .and("be.focused");
  //   cy.get('[aria-label="Class selection popover"]').within(() => {
  //     cy.get('[name="class-selection-search"]').should("not.be.focused");
  //   });

  //   cy.focused().trigger("keydown", {
  //     key: "/",
  //     code: "Slash",
  //     keyCode: "191",
  //   });

  //   cy.get('[aria-label="Class selection popover"]').within(() => {
  //     cy.get('[name="class-selection-search"]').should("be.focused");
  //   });

  //   cy.get("main").click(500, 150);
  //   cy.get('[aria-label="Class selection menu popover"]').should(
  //     "not.be.visible"
  //   );
  //   cy.get('[aria-label="Open class selection popover"]').click();
  //   cy.get('[aria-label="Class selection menu popover"]').should("be.visible");
  //   cy.get('[aria-label="Class selection menu popover"]').within(() => {
  //     cy.get('[name="class-selection-search"]').should("not.be.focused");
  //   });

  //   cy.focused().trigger("keydown", {
  //     key: "/",
  //     code: "Slash",
  //     keyCode: "191",
  //   });

  //   cy.get('[aria-label="Class selection menu popover"]').within(() => {
  //     cy.get('[name="class-selection-search"]').should("be.focused");
  //   });
  // });
});
