import { gql } from "@apollo/client";

import { client } from "../../typescript/web/src/connectors/apollo-client/schema-client";
import { declarePolygonDrawingTests } from "./polygon-drawing.common";

const createDataset = async (name: string) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String) {
        createDataset(data: { name: $name, workspaceSlug: "local" }) {
          id
          slug
        }
      }
    `,
    variables: {
      name,
    },
  });

  const {
    data: {
      createDataset: { id, slug },
    },
  } = mutationResult;

  return { id, slug };
};

async function createImage(url: string, datasetId: string) {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($url: String, $datasetId: ID!) {
        createImage(data: { url: $url, datasetId: $datasetId }) {
          id
          name
          width
          height
          url
        }
      }
    `,
    variables: {
      datasetId,
      url,
    },
  });

  const {
    data: { createImage: image },
  } = mutationResult;

  return image;
}

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

describe("Polygon drawing (local)", () => {
  let datasetId: string;
  let datasetSlug: string;
  let imageId: string;
  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.window().then(async () => {
      const createResult = await createDataset("cypress test dataset");
      datasetId = createResult.id;
      datasetSlug = createResult.slug;

      const { id } = await createImage(
        "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        datasetId
      );
      imageId = id;

      await createLabelClass("Rocket", "#F87171", datasetId);
    });
  });

  declarePolygonDrawingTests({
    workspaceSlug: "local",
    getDatasetSlug: () => datasetSlug,
    getImageId: () => imageId,
  });
});
