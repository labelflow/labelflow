import { gql } from "@apollo/client";

import { LabelCreateInput } from "../../typescript/graphql-types";
import { client } from "../../typescript/web-app/src/connectors/apollo-client/schema-client";

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

describe("Class selection popover", () => {
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

      const labelClassId = await createLabelClass(
        "A new class",
        "#F87171",
        projectId
      );
      await createLabel({
        imageId,
        labelClassId,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [0, 900],
              [900, 900],
              [900, 1500],
              [0, 1500],
              [0, 900],
            ],
          ],
        },
      });
    })
  );

  it("right clicks on a label to change its class", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/projects/${projectId}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
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

    cy.get('[aria-label="Drawing box tool"]').click();
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
    cy.wrap(createLabelClass("My new class", "#65A30D", projectId));

    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/projects/${projectId}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
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

    cy.get('[aria-label="Drawing box tool"]').click();
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

    cy.get('[aria-label="Selection tool"]').click();
    cy.get("main").click(450, 350);
    cy.get('[aria-label="Open class selection popover"]')
      .contains("My new class")
      .should("be.visible");
  });

  it("uses shortcuts to change classes", () => {
    cy.wrap(createLabelClass("My new class", "#65A30D", projectId));
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/projects/${projectId}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
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

  it("should update the label classes list when a label class is deleted", () => {
    cy.visit(
      `/projects/${projectId}/images/${imageId}?modal-welcome=closed&modal-update-service-worker=update`
    );

    cy.contains("cypress test project").click();

    cy.contains("classes").click();
    cy.url().should("contain", `/projects/${projectId}/classes`);

    cy.get('[aria-label="Delete class"]').click();

    cy.get('[aria-label="Confirm deleting class"]').click();
    cy.contains(/^images$/).click();
    cy.get("main").contains("photo-1579513141590-c597876aefbc").click();

    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Selection tool"]').click();

    cy.get("main").rightclick(500, 150);
    cy.get('[aria-label="Class selection popover"]')
      .contains("A new class")
      .should("not.exist");
  });
});
