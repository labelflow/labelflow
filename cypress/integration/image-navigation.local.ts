import { gql } from "@apollo/client";

import { client } from "../../typescript/web/src/connectors/apollo-client/schema-client";
import { declareImageNavigationTests } from "./image-navigation.common";

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
      createDataset: { slug },
    },
  } = mutationResult;

  return slug;
};

describe("Image Navigation", () => {
  let datasetSlug: string;
  beforeEach(() => {
    cy.setCookie("consentedCookies", "true");
    cy.window().then(async () => {
      const slug = await createDataset("cypress test dataset");
      datasetSlug = slug;
    });
  });

  declareImageNavigationTests({
    workspaceSlug: "local",
    getDatasetSlug: () => datasetSlug,
  });
});
