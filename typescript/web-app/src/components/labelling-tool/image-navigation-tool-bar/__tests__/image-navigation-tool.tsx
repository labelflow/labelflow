/* eslint-disable import/first */
/* eslint-disable import/order */

import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
// eslint-disable-next-line import/no-extraneous-dependencies
import { mocked } from "ts-jest/utils";
import probe from "probe-image-size";

import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter();

import { useRouter } from "next/router";
import { gql, ApolloProvider } from "@apollo/client";

import { ImageNavigationTool } from "../image-navigation-tool";
import { client } from "../../../../connectors/apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("probe-image-size");
const mockedProbeSync = mocked(probe.sync);

const createImage = async (name: String) => {
  mockedProbeSync.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
    length: 1000,
    hUnits: "px",
    wUnits: "px",
    url: "https://example.com/image.jpeg",
    type: "jpg",
  });
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!) {
        createImage(data: { name: $name, file: $file }) {
          id
        }
      }
    `,
    variables: {
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

test("should display a dash when the image id isn't present", async () => {
  renderImageNavigationTool();

  // We look for the "left" value, the one in the 'input`
  expect(screen.queryByDisplayValue(/-/i)).toBeInTheDocument();
});

test("should display zero when empty image list", async () => {
  renderImageNavigationTool();

  // We look for the "right" value, the total count.
  await waitFor(() => expect(screen.queryByText(/0/i)).toBeInTheDocument());
});

test("should display one when only one image in list", async () => {
  const imageId = await createImage("testImage");
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { id: imageId },
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
    query: { id: imageId },
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

  expect(mockedPush).toHaveBeenCalledWith(`/images/${oldestImageId}`);
});

test("should select next image when the right arrow is pressed", async () => {
  const mockedPush = jest.fn();
  await createImage("testImageA");
  incrementMockedDate(1);
  const imageId = await createImage("testImageB");
  incrementMockedDate(1);
  const newestImageId = await createImage("testImageC");

  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { id: imageId },
    push: mockedPush,
  }));
  const { container } = renderImageNavigationTool();

  // We need to make sure that images have been loaded
  await waitFor(() =>
    expect(screen.getByRole("button", { name: /^Next image$/i })).toBeDefined()
  );

  userEvent.type(container, "{arrowright}");

  expect(mockedPush).toHaveBeenCalledWith(`/images/${newestImageId}`);
});
