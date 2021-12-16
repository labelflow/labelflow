import { gql } from "@apollo/client";

import { LabelCreateInput, LabelType } from "../../typescript/graphql-types";
import { client } from "../../typescript/web/src/connectors/apollo-client/schema-client";
import { declareClassSelectionPopoverTests } from "./class-selection-popover.common";
import { createDataset } from "./graphql-definitions.common";

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

const createLabel = (data: LabelCreateInput) => {
  return client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput!) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data,
    },
  });
};

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

      const { id } = await createImage(
        "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
        datasetId
      );
      imageId = id;

      const labelClassId = await createLabelClass(
        "A new class",
        "#F87171",
        datasetId
      );
      await createLabel({
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
      });
    });
  });

  declareClassSelectionPopoverTests({
    client,
    workspaceSlug: "local",
    getDatasetId: () => datasetId,
    getDatasetSlug: () => datasetSlug,
    getImageId: () => imageId,
  });
});
