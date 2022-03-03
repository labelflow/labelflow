import { DATASET_SLUG, WORKSPACE_SLUG } from "../fixtures";

const TEST_CLASSES = ["cat", "dog", "hedgehog"];

const getClassTd = (name: string) =>
  cy.get('[data-testid="reorderable-table-body"]').contains("td", name);

const visibleClasses = (labelClasses: string[]): void =>
  labelClasses.forEach((labelClass) =>
    getClassTd(labelClass).should("be.visible")
  );

describe("Dataset Classes", () => {
  it("Adds many label-classes at once and searches for one of them", () => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets");
    cy.setCookie("consentedCookies", "true");
    cy.visit(`/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/classes`);
    cy.get('[data-testid="add-button"]').should("be.visible");
    cy.get('[data-testid="add-button"]').click();
    cy.get('[data-testid="class-names-input"]').should("be.visible");
    cy.get('[data-testid="class-names-input"]').type(TEST_CLASSES.join("\n"));
    cy.get('[data-testid="create-classes-button"]').click();
    cy.get('[data-testid="add-button"]').should("be.visible");
    visibleClasses(TEST_CLASSES);
    cy.get('[data-testid="search-input"]').type("og");
    const [cat, ...containsOg] = TEST_CLASSES;
    getClassTd(cat).should("not.exist");
    visibleClasses(containsOg);
  });
});
