/* eslint-disable import/first */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { ApolloProvider, gql } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { LabelCreateInput } from "@labelflow/graphql-types";
import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";
import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter({
  query: { datasetSlug: "test-dataset", workspaceSlug: "local" },
});

import { ExportModal } from "..";
import { theme } from "../../../../theme";
import { client } from "../../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  </ApolloProvider>
);

const createDataset = async (
  datasetId = "mocked-dataset-id",
  name = "test dataset"
) => {
  return await client.mutate({
    mutation: gql`
      mutation createDataset($name: String!, $datasetId: ID) {
        createDataset(
          data: { name: $name, id: $datasetId, workspaceSlug: "local" }
        ) {
          id
        }
      }
    `,
    variables: { datasetId, name },
  });
};

const labelData = {
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
  },
};

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

const imageWidth = 500;
const imageHeight = 900;

const createImage = async (name: String) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage(
        $file: Upload!
        $name: String!
        $width: Int
        $height: Int
        $datasetId: ID!
      ) {
        createImage(
          data: {
            name: $name
            file: $file
            width: $width
            height: $height
            datasetId: $datasetId
          }
        ) {
          id
        }
      }
    `,
    variables: {
      file: new Blob(),
      name,
      width: imageWidth,
      height: imageHeight,
      datasetId: "mocked-dataset-id",
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
};

test("File should be downloaded when user clicks on Export to COCO and Export", async () => {
  await createDataset();
  render(<ExportModal isOpen />, { wrapper });
  const anchorMocked = {
    href: "",
    click: jest.fn(),
  } as any;
  const createElementOriginal = document.createElement.bind(document);
  jest.spyOn(document, "createElement").mockImplementation((name, options) => {
    if (name === "a") {
      return anchorMocked;
    }
    return createElementOriginal(name, options);
  });

  await waitFor(() => {
    userEvent.click(screen.getByText("Export to COCO"));
    expect(screen.getByText("Export Options")).toBeDefined();
  });
  userEvent.click(screen.getByRole("button", { name: "Export" }));

  await waitFor(() => expect(anchorMocked.click).toHaveBeenCalledTimes(1));
}, 20000);

test("Export Modal should display the number of labels", async () => {
  await createDataset();
  await createDataset("second-dataset-id", "second-test-dataset");
  mockedProbeSync.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
  });
  const imageId = await createImage("an image");
  await createLabel({
    ...labelData,
    imageId,
  });
  incrementMockedDate(1);
  await createLabel({
    ...labelData,
    imageId,
  });

  render(<ExportModal isOpen />, { wrapper });

  await waitFor(() =>
    expect(screen.getByRole("banner").textContent).toEqual(
      expect.stringContaining("1 images and 2 labels")
    )
  );
});
