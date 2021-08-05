import { gql } from "@apollo/client";
import { client } from "../../typescript/web-app/src/connectors/apollo-client-schema";

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

describe("Index page redirection", () => {
  beforeEach(() =>
    cy.window().then(async () => {
      const projectId = await createProject("Demo project");

      await createImage(
        "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        projectId
      );
    })
  );
  it("Redirects to labelling tool on first user visit", () => {
    cy.clearLocalStorage();
    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').should("exist");
  });

  it("Redirects to projects page when it's not the first visit", () => {
    localStorage.setItem("isFirstVisit", "false");
    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').should("not.exist");
    cy.get('[aria-label="Create new project"]').should("exist");
  });
});
