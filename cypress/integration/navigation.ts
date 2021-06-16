import { db } from "../../typescript/web-app/src/connectors/database";
import {
  useLabellingStore,
} from "../../typescript/web-app/src/connectors/labelling-state";

describe("Labelling tool", () => {
  beforeEach(() => {
    return Promise.all([
      db.image.clear(),
      db.label.clear(),
      db.labelClass.clear(),
      db.file.clear(),
    ]);
  });

  it("should clear the undo redo store between images", () => {
    // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
    cy.visit("http://localhost:3000/images?modal-welcome-disable");
    cy.contains("Add images").click();
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(
      "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80\nhttps://images.unsplash.com/photo-1504710685809-7bb702595f8f?auto=format&fit=crop&w=934&q=80"
    );
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.contains("photo").click();
    cy.get('[aria-label="Drawing tool"]', { timeout: 15000 }).click();
    cy.get("main").click(200, 200);
    cy.get("main").click(300, 300);
    cy.get('[aria-label="Next image"]').click();

    cy.get('[aria-label="Undo tool"]').should("be.disabled");
  });

  it.only("should select labels correctly", async () => {
    cy.visit("http://localhost:3000/images");
    cy.contains("Add images").click();
    cy.contains("Import from a list of URLs instead").click();
    cy.get("textarea").type(
      "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80\nhttps://images.unsplash.com/photo-1504710685809-7bb702595f8f?auto=format&fit=crop&w=934&q=80"
    );
    cy.contains("Start Import").click();
    cy.get(`[aria-label="Close"]`).click();
    cy.visit("http://localhost:3000/images");
    cy.contains("photo").click();
    cy.get('[aria-label="Drawing tool"]').click();
    // Create one bb
    cy.get("main").click(400, 100);
    cy.get("main").click(600, 200);
    // expect(useLabellingStore.getState().selectedLabelId).not.to.be.null;
    const initialSelectedId = useLabellingStore.getState().selectedLabelId;
    // console.log("initialSelectedId = ", initialSelectedId);
    cy.get('[aria-label="Select tool"]').click();
    // Unselect bb
    cy.get("main").click(50, 50);
    expect(useLabellingStore.getState().selectedLabelId).to.be.null;
    // Select bb
    cy.get("main").click(500, 150);
    expect(useLabellingStore.getState().selectedLabelId).to.equal(initialSelectedId);
    // // Check there are no labelClasses created
    const labelClassCountBefore = db.labelClass.count();
    // cy.log(Object.keys(cy.wrap(labelClassCountBefore)).join(", "))
    // console.log(cy.wrap(labelClassCountBefore))
    cy.wrap(labelClassCountBefore).should('eq', 0);
    // expect(cy.wrap(labelClassCountBefore)).to.equal(0);
    // Create new class
    cy.get("main").rightclick(500, 150);
    cy.focused().type("My new class{enter}");
    // // Check there is 1 labelClass created
    const labelClassCountAfter1 = db.labelClass.count();
    cy.wrap(labelClassCountAfter1).should('eq', 1);
    // expect(labelClassCountAfter1).to.equal(1);
    // Create second class
    cy.get("main").rightclick(500, 150);
    cy.focused().type("My other class{enter}");
    // Check there are 2 labelClass created
    const labelClassCountAfter2 = db.labelClass.count();
    cy.wrap(labelClassCountAfter2).should('eq', 3);
    // expect(labelClassCountAfter2).to.equal(2);
    // const label = await db.label.get(initialSelectedId)
    // const labelClass = await db.labelClass.get(label?.labelClassId as string);
    // expect(labelClass?.name).to.equal("My other class")
    // cy.get("main").rightclick(500, 150);
    // cy.focused().type("{downarrow}{enter}");
    // const label1 = await db.label.get(initialSelectedId)
    // const labelClass1 = await db.labelClass.get(label1?.labelClassId as string);
    // expect(labelClass1?.name).to.equal("My new class")
    cy.get('[aria-label="Next image"]').click();
    cy.get('[aria-label="Undo tool"]').should("be.disabled");
  });
});
