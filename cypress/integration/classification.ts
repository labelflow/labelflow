import { gql } from "@apollo/client";

import { client } from "../../typescript/web/src/connectors/apollo-client/schema-client";

const createDataset = async (name: string) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String) {
        createDataset(data: { name: $name, workspaceSlug: "local" }) {
          id
          slug
        }
      }
    `,
    variables: {
      name,
    },
  });

  const {
    data: {
      createDataset: { id, slug },
    },
  } = mutationResult;

  return { id, slug };
};

async function createImage(url: string, datasetId: string) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($url: String, $datasetId: ID!) {
        createImage(data: { url: $url, datasetId: $datasetId }) {
          id
          name
          width
          height
          url
        }
      }
    `,
    variables: {
      datasetId,
      url,
    },
  });

  const {
    data: { createImage: image },
  } = mutationResult;

  return image;
}

const createLabelClass = async (
  name: String,
  color = "#ffffff",
  datasetId: string
) => {
  const {
    data: {
      createLabelClass: { id },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createLabelClass(
        $name: String!
        $color: String!
        $datasetId: ID!
      ) {
        createLabelClass(
          data: { name: $name, color: $color, datasetId: $datasetId }
        ) {
          id
          name
          color
        }
      }
    `,
    variables: {
      name,
      color,
      datasetId,
    },
  });

  return id;
};

describe("Classification", () => {
  let datasetId: string;
  let datasetSlug: string;
  let imageId: string;
  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.window().then(async () => {
      const createResult = await createDataset("cypress test dataset");
      datasetId = createResult.id;
      datasetSlug = createResult.slug;

      const { id } = await createImage(
        "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        datasetId
      );
      imageId = id;

      await createLabelClass("Rocket", "#F87171", datasetId);
    });
  });

  it("switches between drawing tools", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/local/datasets/${datasetSlug}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Drawing classification tool"]').should("not.exist");
    cy.get('[aria-label="Drawing box tool"]').should("exist").click();
    cy.get('[aria-label="Change Drawing tool"]').click();
    cy.get('[aria-label="Bounding box tool"]').should(
      "have.attr",
      "aria-checked",
      "true"
    );
    cy.get('[aria-label="Classification tool"]')
      .should("have.attr", "aria-checked", "false")
      .click();

    cy.get('[aria-label="Drawing classification tool"]').should("exist");
    cy.get('[aria-label="Drawing box tool"]').should("not.exist");
  });

  it("add classses and remove them", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/local/datasets/${datasetSlug}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );

    // Switch to classification tool
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Change Drawing tool"]').should("exist").click();
    cy.get('[aria-label="Classification tool"]').click();

    // Create a classification tag with the existing class "rocket"
    cy.wait(1000);
    cy.get("main").rightclick(475, 100);
    cy.wait(1000);
    cy.get('[aria-label="Class selection popover"]')
      .contains("Rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "false")
      .click();

    // Create a classification tag with the existing class "rocket"
    cy.wait(1000);
    cy.get("main").rightclick(100, 100);
    cy.wait(1000);
    cy.get('[aria-label="Class selection popover"]').within(() => {
      cy.get('[name="class-selection-search"]').click();
      cy.wait(1000);
      cy.get('[name="class-selection-search"]').type("My new class{enter}");
    });

    // Remove label using dustbin button in option toolbar
    cy.wait(1000);
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "be.visible"
    );
    cy.get('[aria-label="Delete selected label"]').click();
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "not.exist"
    );

    // Remove label by clicking close button of tag
    cy.wait(1000);
    cy.get('[aria-label="Classification tag: Rocket"]').should("be.visible");
    cy.get('[aria-label="Classification tag: Rocket"]')
      .get('[aria-label="close"]')
      .click();
    cy.get('[aria-label="Classification tag: Rocket"]').should("not.exist");

    // Add a label with the add menu
    cy.wait(1000);
    cy.get('[aria-label="Classification tag: Rocket"]').should("not.exist");
    cy.get('[aria-label="Add a label"]').click();
    cy.get('[aria-label="Class addition menu popover"]')
      .contains("Rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "false")
      .click();
    cy.get('[aria-label="Classification tag: Rocket"]').should("be.visible");

    // Add a label with key shortcut
    cy.wait(1000);
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "not.exist"
    );
    cy.get('[aria-label="Add a label"]').click();
    cy.get("body").type("2");
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "be.visible"
    );

    // Switch to selection mode
    cy.wait(1000);
    cy.get("body").type("v");

    // Edit a label to another class of an existing label, should merge
    cy.wait(1000);
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "be.visible"
    );
    cy.get('[aria-label="Classification tag: My new class"]').rightclick();
    cy.wait(1000);
    cy.get("body").type("1");
    cy.get('[aria-label="Classification tag: My new class"]').should(
      "not.exist"
    );

    // Switch to classification mode
    cy.wait(1000);
    cy.get("body").type("k");

    // Remove last label with keyboard shortcut of addition
    cy.wait(1000);
    cy.get('[aria-label="Classification tag: Rocket"]').should("be.visible");
    cy.get("body").type("1");
    cy.get('[aria-label="Classification tag: Rocket"]').should("not.exist");
  });
});
