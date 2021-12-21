import { LabelType } from "../../typescript/graphql-types";
import { client } from "../../typescript/web/src/connectors/apollo-client/schema-client";
import { declareTests } from "./class-selection-popover.common";
import {
  createDataset,
  createImage,
  createLabel,
  createLabelClass,
} from "./graphql-definitions.common";

describe("Class selection popover (local)", () => {
  let datasetId!: string;
  let datasetSlug!: string;
  let imageId!: string;
  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.window().then(async () => {
      const createResult = await createDataset({
        name: "cypress test dataset",
        client,
        workspaceSlug: "local",
      });
      datasetId = createResult.id;
      datasetSlug = createResult.slug;

      const { id } = await createImage({
        url: "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        datasetId,
        client,
      });
      imageId = id;

      const labelClassId = await createLabelClass({
        name: "A new class",
        color: "#F87171",
        datasetId,
        client,
      });
      await createLabel({
        data: {
          imageId,
          labelClassId,
          type: LabelType.Box,
          geometry: {
            type: LabelType.Polygon,
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
        },
        client,
      });
    });
  });

  declareTests({
    client,
    workspaceSlug: "local",
    getDatasetId: () => datasetId,
    getDatasetSlug: () => datasetSlug,
    getImageId: () => imageId,
  });
});
