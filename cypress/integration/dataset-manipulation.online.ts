import { declareDatasetManipulationTests } from "./dataset-manipulation.common";

describe("Dataset creation, edition, deletion", () => {
  beforeEach(() => {
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspace");
  });
  declareDatasetManipulationTests("cypress-test-workspace");
});
