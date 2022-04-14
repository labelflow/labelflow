import imageSampleCollection from "../../typescript/web/src/utils/image-sample-collection";
import { WORKSPACE_SLUG, DATASET_SLUG } from "../fixtures";

describe("Image Navigation (online)", () => {
  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets");
  });

  it("Should let the user navigate within the image gallery", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit(
      `/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images?modal-welcome=closed`
    );
    cy.contains("You don't have any images").should("be.visible");
    cy.wait(420);
    cy.get("header").within(() => {
      cy.contains("Add images").click();
    });
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(imageSampleCollection.slice(0, 8).join("\n"), {
      delay: 0,
    });
    cy.contains("Start Import").click();
    cy.get(`[data-testid="start-labeling-button"]`).click();
    cy.get(
      `[data-testid="image-card-${
        imageSampleCollection[1]
          .split("?")[0]
          .split("https://images.unsplash.com/")[1]
      }"]`
    )
      .trigger("mouseover")
      .click();

    // Check that we can reach the end of the list
    cy.get("main nav").scrollTo("right");
    cy.get("main nav").within(() => {
      cy.contains("8").closest("a").click();
    });
    cy.get('input[name="current-image"]').should("have.value", "8");

    // Check that we can navigate to the middle of the list
    cy.get('input[name="current-image"]').type("4{enter}");
    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("4");
    });

    // check that the gallery is centered on the correct image after a reload
    cy.reload();
    cy.get('[aria-current="page"]').should(($a) => {
      expect($a).to.contain("4");
    });
  });
});
