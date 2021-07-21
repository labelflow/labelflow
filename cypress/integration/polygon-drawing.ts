import { gql } from "@apollo/client";

import { client } from "../../typescript/web-app/src/connectors/apollo-client-schema";
import { LabelCreateInput } from "../../typescript/web-app/src/graphql-types.generated";

const createProject = async (name: string) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createProject($name: String) {
        createProject(data: { name: $name }) {
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
      createProject: { id },
    },
  } = mutationResult;

  return id;
};

async function createImage(url: string, projectId: string) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($url: String, $projectId: ID!) {
        createImage(data: { url: $url, projectId: $projectId }) {
          id
          name
          width
          height
          url
        }
      }
    `,
    variables: {
      projectId,
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
  projectId: string
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
        $projectId: ID!
      ) {
        createLabelClass(
          data: { name: $name, color: $color, projectId: $projectId }
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
      projectId,
    },
  });

  return id;
};

describe("Polygon drawing", () => {
  let projectId: string;
  let imageId: string;
  beforeEach(() =>
    cy.window().then(async () => {
      projectId = await createProject("cypress test project");

      const { id } = await createImage(
        "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        projectId
      );
      imageId = id;

      await createLabelClass("This is not a rocket", "#f4bedc", projectId);
    })
  );

  it("switches between drawing tools", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/projects/${projectId}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Drawing polygon tool"]').should("not.exist");
    cy.get('[aria-label="Drawing box tool"]').should("exist").click();
    cy.get('[aria-label="Change Drawing tool"]').click();
    cy.get('[aria-label="Select bounding box tool"]').should(
      "have.attr",
      "aria-checked",
      "true"
    );
    cy.get('[aria-label="Select polygon tool"]')
      .should("have.attr", "aria-checked", "false")
      .click();

    cy.get('[aria-label="Drawing polygon tool"]').should("exist");
    cy.get('[aria-label="Drawing box tool"]').should("not.exist");
  });

  it("draws a polygon", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/projects/${projectId}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Change Drawing tool"]').should("exist").click();
    cy.get('[aria-label="Select polygon tool"]').click();
    cy.get("main").click(475, 75);
    cy.get("main").click(450, 100);
    cy.get("main").click(450, 200);
    cy.get("main").click(425, 240);
    cy.get("main").click(450, 260);
    cy.get("main").click(475, 220);
    cy.get("main").click(500, 260);
    cy.get("main").click(525, 240);
    cy.get("main").click(500, 200);
    cy.get("main").dblclick(500, 100);

    cy.get("main").rightclick(475, 100);

    cy.get('[aria-label="Class selection popover"]')
      .contains("This is not a rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "false")
      .click();
    cy.get("main").rightclick(475, 100);
    cy.get('[aria-label="Class selection popover"]')
      .contains("This is not a rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
  });
});
