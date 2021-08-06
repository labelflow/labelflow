import { gql } from "@apollo/client";
import Dexie from "dexie";
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

describe("Demo project creation", () => {
  beforeEach(async () => {
    if (window.navigator && navigator.serviceWorker) {
      console.log("Will unregiter seriver worker");

      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((registration) => registration.unregister())
      );
    }
    // await Promise.all(db.tables.map((table) => table.clear()));
    console.log("Will Delete db");
    await Dexie.delete("labelflow_local");
    console.log("Will clear storage");
    cy.clearLocalStorage();
    console.log("Will reload");
    cy.window().reload();
    console.log("Done");
  });

  it.only("Creates a demo project when the user connects to the app for the first time", () => {
    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);
    cy.url().should(
      "match",
      /.\/projects\/([a-zA-Z0-9_-]*)\/images\/([a-zA-Z0-9_-]*)/
    );
    cy.contains("Demo project").should("exist");
  });
});

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
    cy.url().should(
      "match",
      /.\/projects\/([a-zA-Z0-9_-]*)\/images\/([a-zA-Z0-9_-]*)/
    );
  });

  it("Redirects to projects page when it's not the first visit", () => {
    localStorage.setItem("isFirstVisit", "false");
    cy.visit(`/?modal-welcome=closed&modal-update-service-worker=update`);
    cy.url().should("match", /.\/projects/);
  });
});
