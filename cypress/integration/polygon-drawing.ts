import { DATASET_SLUG, WORKSPACE_SLUG, EXAMPLE_POLYGON } from "../fixtures";

import { createImage, createLabelClass } from "../utils/graphql";

const LABEL_CLASS_NAME = "Logo";

const DRAW_X_OFFSET = 340;
const DRAW_Y_OFFSET = 390;

const getPoint = ([x, y]: [number, number]): [number, number] => [
  x + DRAW_X_OFFSET,
  y * -1 + DRAW_Y_OFFSET,
];

const drawPolygon = (geometry: [number, number][]): void => {
  for (let i = 0; i < geometry.length - 1; i += 1) {
    cy.get("main").click(...getPoint(geometry[i]));
    cy.wait(100);
  }
  cy.get("main").dblclick(...getPoint(geometry[geometry.length - 1]));
};

describe("Polygon drawing (online)", () => {
  let imageId: string;

  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets").then(async ({ datasetId }: any) => {
      const { id } = await createImage({
        url: "https://labelflow.ai/static/icon-512x512.png",
        datasetId,
      });
      imageId = id;

      await createLabelClass({
        name: LABEL_CLASS_NAME,
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
    cy.get('[aria-label="Change Drawing tool"]').should("be.visible").click();
    cy.get('[aria-label="Polygon tool"]').click();

    cy.wait(420);
    drawPolygon(EXAMPLE_POLYGON);

    cy.wait(420);
    cy.get("main").rightclick(500, 330);
    cy.get('[aria-label="Class selection popover"]')
      .contains(LABEL_CLASS_NAME)
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "false")
      .click();

    cy.wait(420);
    cy.get("main").rightclick(500, 330);
    cy.get('[aria-label="Class selection popover"]')
      .contains(LABEL_CLASS_NAME)
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
  });
});
