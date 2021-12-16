import { gql } from "@apollo/client";

import { distantDatabaseClient as client } from "../../typescript/web/src/connectors/apollo-client/client";
import { declareClassificationTests } from "./classification.common";
import { createDataset, createImage } from "./graphql-definitions.common";

const createLabelClass = async (
  name: String,
  color = "#ffffff",
  datasetId: string
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
        $datasetId: ID!
      ) {
        createLabelClass(
          data: { name: $name, color: $color, datasetId: $datasetId }
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
      datasetId,
    },
  });

  return id;
};

describe("Classification (online)", () => {
  let datasetId: string;
  let datasetSlug: string;
  let imageId: string;
  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.task("performLogin").then((token) => {
      cy.setCookie("next-auth.session-token", token as string);
    });
    cy.task("createWorkspaceAndDatasets").then(async () => {
      const createResult = await createDataset({
        name: "cypress test dataset",
        workspaceSlug: "cypress-test-workspace",
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

      await createLabelClass("Rocket", "#F87171", datasetId);
    });
  });

  declareClassificationTests({
    workspaceSlug: "cypress-test-workspace",
    getDatasetSlug: () => datasetSlug,
    getImageId: () => imageId,
  });
});
