import { gql } from "@apollo/client";

import { client } from "../../typescript/web/src/connectors/apollo-client/schema-client";

const createDataset = async (name: string) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String) {
        createDataset(data: { name: $name }) {
          id
        }
      }
    `,
    variables: {
      name,
    },
  });

  const {
    data: {
      createDataset: { id },
    },
  } = mutationResult;

  return id;
};

describe("Image Navigation", () => {
  let datasetId: string;
  beforeEach(() =>
    cy.window().then(async () => {
      datasetId = await createDataset("cypress test dataset");
    })
  );

  it("Should let the user navigate within the image gallery", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `http://localhost:3000/local/datasets/${datasetId}/images?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.contains("You don't have any images.").should("be.visible");
    cy.get("header").within(() => {
      cy.contains("Add images").click();
    });
    cy.contains("Import from a list of URLs instead").click();
    cy.contains("Insert example images").click();
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.get("main").contains("photo").click();

    // Check that we can reach the end of the list
    cy.get("main nav").scrollTo("right");
    cy.get("main nav").within(() => {
      cy.contains("100").closest("a").click();
    });
    cy.get('input[name="current-image"]').should("have.value", "100");

    // Check that we can navigate to the middle of the list
    cy.get('input[name="current-image"]').type("50{enter}");
    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("50");
    });

    // check that the gallery is centered on the correct image after a reload
    cy.reload();
    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("50");
    });
  });
});
