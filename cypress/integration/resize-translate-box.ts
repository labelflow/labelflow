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
  beforeEach(() =>
    cy.window().then(async () => {
      console.log("Create data");
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
    })
  );

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
      .trigger("pointerup", { eventConstructor: "PointerEvent", force: true });
  });

  // it("resizes the label from one corner", () => {
  //   // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
  //   cy.visit(
  //     `/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
  //   );
  //   cy.get('[aria-label="loading indicator"]').should("not.exist");
  //   cy.get('[aria-label="Selection tool"]').click();
  //   // Select label
  //   cy.get("main").click(500, 150);
  //   // Click and drag to resize
  //   cy.get("canvas")
  //     .trigger("pointerdown", 250, 0, { eventConstructor: "PointerEvent" })
  //     .trigger("pointermove", 500, 300, { eventConstructor: "PointerEvent" })
  //     .trigger("pointerUp", { eventConstructor: "PointerEvent" });
  // });
});
