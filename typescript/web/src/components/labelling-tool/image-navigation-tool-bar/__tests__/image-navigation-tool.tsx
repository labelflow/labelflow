/* eslint-disable import/first */
/* eslint-disable import/order */

import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter();

import { useRouter } from "next/router";
import { gql, ApolloProvider } from "@apollo/client";

import { ImageNavigationTool } from "../image-navigation-tool";
import { client } from "../../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;
const testDatasetId = "mocked-dataset-id";

const createImage = async (name: String) => {
  mockedProbeSync.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
  });
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!, $datasetId: ID!) {
        createImage(data: { name: $name, file: $file, datasetId: $datasetId }) {
          id
        }
      }
    `,
    variables: {
      datasetId: testDatasetId,
      file: new Blob(),
      name,
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
};

const renderImageNavigationTool = () =>
  render(<ImageNavigationTool />, {
    wrapper: ({ children }) => (
      <ApolloProvider client={client}>{children}</ApolloProvider>
    ),
  });

beforeEach(async () => {
  await client.mutate({
    mutation: gql`
      mutation createDataset($datasetId: ID!) {
        createDataset(
          data: { name: "test dataset", id: $datasetId, workspaceSlug: "local" }
        ) {
          id
        }
      }
    `,
    variables: {
      datasetId: testDatasetId,
    },
  });
});

test("should display a dash and a zero when the image id isn't present/when the image list is empty", async () => {
  renderImageNavigationTool();

  // We look for the "left" value, the one in the 'input`
  expect(screen.queryByDisplayValue(/-/i)).toBeInTheDocument();

  // We look for the "right" value, the total count.
  await waitFor(() => expect(screen.queryByText(/0/i)).toBeInTheDocument());
});

test("should display one when only one image in list", async () => {
  const imageId = await createImage("testImage");
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { imageId, datasetSlug: "test-dataset" },
  }));

  renderImageNavigationTool();

  await waitFor(() =>
    expect(screen.queryByDisplayValue(/1/i)).toBeInTheDocument()
  );
  await waitFor(() => expect(screen.queryByText(/1/i)).toBeInTheDocument());
});

test("should select previous image when the left arrow is pressed", async () => {
  const mockedPush = jest.fn();
  const oldestImageId = await createImage("testImageA");
  incrementMockedDate(1);
  const imageId = await createImage("testImageB");
  incrementMockedDate(1);

  await createImage("testImageC");
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { imageId, datasetSlug: "test-dataset" },
    push: mockedPush,
  }));

  const { container } = renderImageNavigationTool();

  // We need to make sure that images have been loaded
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: /^Previous image$/i })
    ).toBeDefined()
  );

  userEvent.type(container, "{arrowleft}");

  expect(mockedPush).toHaveBeenCalledWith(
    `/local/datasets/test-dataset/images/${oldestImageId}`
  );
});

test("should select next image when the right arrow is pressed", async () => {
  const mockedPush = jest.fn();
  await createImage("testImageA");
  incrementMockedDate(1);
  const imageId = await createImage("testImageB");
  incrementMockedDate(1);
  const newestImageId = await createImage("testImageC");

  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { imageId, datasetSlug: "test-dataset" },
    push: mockedPush,
  }));
  const { container } = renderImageNavigationTool();

  // We need to make sure that images have been loaded
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /^Next image$/i })).toBeDefined()
  );

  userEvent.type(container, "{arrowright}");

  expect(mockedPush).toHaveBeenCalledWith(
    `/local/datasets/test-dataset/images/${newestImageId}`
  );
});
