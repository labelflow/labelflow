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

describe("Index page redirection", () => {
  beforeEach(() =>
    cy.window().then(async () => {
      const projectId = await createProject("cypress demo project");

      await createImage(
        "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        projectId
      );
    })
  );
  it("Redirects to labelling tool on first user visit", () => {
    localStorage.removeItem("isFirstVisit");
    cy.visit(`/`);
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').should("exist");
  });

  it("Redirects to projects page when it's not the first visit", () => {
    localStorage.setItem("isFirstVisit", "false");
    cy.visit(`/`);
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').should("not.exist");
  });
});
