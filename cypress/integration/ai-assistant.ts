import {
  AiAssistant,
  DETR_COCO_AI_ASSISTANT,
  VIT_IMAGENET_AI_ASSISTANT,
} from "../../typescript/common-resolvers/src/ai-assistant";
import { DATASET_SLUG, WORKSPACE_SLUG } from "../fixtures";
import { createImage } from "../utils/graphql";

// Let enough time for HuggingFace to respond
const waitInference = () => {
  cy.wait(3000);
};

const annotate = (aiAssistant: AiAssistant) => {
  cy.get('[data-testid="ai-assistant-combobox"]').should("be.visible").click();
  cy.get(`[data-testid="ai-assistant-item-${aiAssistant.id}"]`)
    .should("be.visible")
    .click();
  cy.get('[data-testid="ai-assistant-annotate-button"]')
    .should("be.visible")
    .click();
  waitInference();
};

describe("AI Assistant", () => {
  let imageId: string;

  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets").then(async ({ datasetId }: any) => {
      const { id } = await createImage({
        url: "https://images.unsplash.com/photo-1622890276106-7da2455d7174?auto=format&fit=crop&w=640&q=60",
        datasetId,
      });
      imageId = id;
      cy.visit(`/${WORKSPACE_SLUG}/datasets/${DATASET_SLUG}/images/${imageId}`);
      cy.get('[aria-label="loading indicator"]').should("not.exist");
      cy.get('[aria-label="Change Drawing tool"]').should("be.visible").click();
      cy.get('[data-testid="ai-assistant-tool-item"]')
        .should("be.visible")
        .click();
    });
  });

  it(`creates labels with ${DETR_COCO_AI_ASSISTANT.name}`, () => {
    annotate(DETR_COCO_AI_ASSISTANT);
    cy.get("main").rightclick(500, 300);
    cy.get('[aria-label="Class selection popover"]')
      .contains("boat")
      .closest('[role="option"]')
      .should("have.attr", "aria-current", "true");
    cy.get('[data-testid="undo-button"').click();
    cy.get("main").rightclick(500, 300);
    cy.get('[aria-label="Class selection popover"]').should("not.be.visible");
    cy.get('[data-testid="redo-button"').click();
    waitInference();
    cy.get("main").rightclick(500, 300);
    cy.get('[aria-label="Class selection popover"]').should("be.visible");
  });

  it(`creates labels with ${VIT_IMAGENET_AI_ASSISTANT.name}`, () => {
    annotate(VIT_IMAGENET_AI_ASSISTANT);
    cy.get('[aria-label="Classification tag: canoe"]').should("be.visible");
    cy.get('[data-testid="undo-button"').click();
    cy.get('[aria-label="Classification tag: canoe"]').should("not.exist");
    cy.get('[data-testid="redo-button"').click();
    waitInference();
    cy.get('[aria-label="Classification tag: canoe"]').should("be.visible");
  });
});
