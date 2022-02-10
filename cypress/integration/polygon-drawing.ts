import { DATASET_SLUG, WORKSPACE_SLUG } from "../fixtures";
import { createImage, createLabelClass } from "../utils/graphql";

describe("Polygon drawing (online)", () => {
  let imageId: string;

  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets").then(async ({ datasetId }: any) => {
      const { id } = await createImage({
        url: "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        datasetId,
      });
      imageId = id;

      await createLabelClass({
        name: "Rocket",
        color: "#F87171",
        datasetId,
      });
    });
  });

  it("switches between drawing tools", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images/${imageId}?modal-welcome=closed`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Drawing polygon tool"]').should("not.exist");
    cy.get('[aria-label="Drawing box tool"]').should("exist").click();

    cy.wait(420);
    cy.get('[aria-label="Change Drawing tool"]').click();
    cy.get('[aria-label="Bounding box tool"]').should(
      "have.attr",
      "aria-checked",
      "true"
    );

    cy.wait(420);
    cy.get('[aria-label="Polygon tool"]')
      .should("have.attr", "aria-checked", "false")
      .click();

    cy.get('[aria-label="Drawing polygon tool"]').should("exist");
    cy.get('[aria-label="Drawing box tool"]').should("not.exist");
  });

  it("draws a polygon", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images/${imageId}?modal-welcome=closed`
    );
    cy.get('[aria-label="loading indicator"]').should("not.exist");
    cy.get('[aria-label="Change Drawing tool"]').should("exist").click();
    cy.get('[aria-label="Polygon tool"]').click();

    cy.wait(420);
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

    cy.wait(420);
    cy.get("main").rightclick(475, 100);
    cy.get('[aria-label="Class selection popover"]')
      .contains("Rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "false")
      .click();

    cy.wait(420);
    cy.get("main").rightclick(475, 100);
    cy.get('[aria-label="Class selection popover"]')
      .contains("Rocket")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
  });
});
