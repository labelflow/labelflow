import { client } from "../../typescript/web/src/connectors/apollo-client/schema-client";
import {
  createDataset,
  createImage,
  createLabelClass,
} from "./graphql-definitions.common";
import { declareTests } from "./polygon-drawing.common";

describe("Polygon drawing (local)", () => {
  let datasetId: string;
  let datasetSlug: string;
  let imageId: string;
  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.window().then(async () => {
      const createResult = await createDataset({
        name: "cypress test dataset",
        workspaceSlug: "local",
        client,
      });
      datasetId = createResult.id;
      datasetSlug = createResult.slug;

      const { id } = await createImage({
        url: "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        datasetId,
        client,
      });
      imageId = id;

      await createLabelClass({
        name: "Rocket",
        color: "#F87171",
        datasetId,
        client,
      });
    });
  });

  declareTests({
    workspaceSlug: "local",
    getDatasetSlug: () => datasetSlug,
    getImageId: () => imageId,
  });
});
