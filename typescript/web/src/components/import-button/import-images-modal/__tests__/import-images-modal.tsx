/* eslint-disable import/first */
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider, gql } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";
import { processImage } from "../../../../connectors/repository/image-processing";
import { client } from "../../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";
import {
  mockUseQueryParams,
  mockNextRouter,
} from "../../../../utils/router-mocks";

mockUseQueryParams();
mockNextRouter({
  query: { datasetSlug: "test-dataset", workspaceSlug: "local" },
});

import { ImportImagesModal } from "../import-images-modal";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

setupTestsWithLocalDatabase();

jest.mock("../../../../connectors/repository/image-processing");
const mockedProcessImage = processImage as jest.Mock;

mockedProcessImage.mockReturnValue({
  width: 42,
  height: 36,
  mime: "image/jpeg",
  length: 1000,
  hUnits: "px",
  wUnits: "px",
  url: "https://example.com/image.jpeg",
  type: "jpg",
});

/**
 * Mock the apollo client to avoid creating corrupted files that allows
 * us to identify a behaviour.
 */
jest.mock("../../../../connectors/apollo-client/schema-client", () => {
  const original = jest.requireActual(
    "../../../../connectors/apollo-client/schema-client"
  );

  return {
    client: {
      ...original.client,
      mutate: jest.fn(original.client.mutate),
      refetchQueries: () => {},
      writeQuery: original.client.writeQuery,
    },
  };
});

/**
 * This behavior is already tested in the previous test.
 * However, we need to wait for the upload to finish.
 * Otherwise, the cleanup in the `beforeEach` messes
 * with the ongoing logic.
 */
async function ensuresUploadsAreFinished(number = 2) {
  await waitFor(() =>
    expect(screen.getAllByLabelText("Upload succeed")).toHaveLength(number)
  );
}

function renderModalAndImport(filesToImport = files, props = {}) {
  render(<ImportImagesModal isOpen onClose={() => {}} {...props} />, {
    wrapper: Wrapper,
  });

  const input = screen.getByLabelText(
    /Drop images, annotations, or click to browse/i
  );
  return waitFor(() => userEvent.upload(input, filesToImport));
}

beforeEach(async () => {
  await client.mutate({
    mutation: gql`
      mutation {
        createDataset(
          data: {
            name: "test dataset"
            id: "mocked-dataset-id"
            workspaceSlug: "local"
          }
        ) {
          id
        }
      }
    `,
  });
});

test("should display the number of valid images", async () => {
  await renderModalAndImport();

  await waitFor(() =>
    expect(screen.getByText(/Completed 2 of 2 items/i)).toBeDefined()
  );
  expect(
    screen.queryByLabelText(/Drop images, annotations, or click to browse/i)
  ).not.toBeInTheDocument();
});

test("should display an indicator when upload succeed", async () => {
  await renderModalAndImport(files.slice(0, 1));

  await waitFor(() =>
    expect(screen.getByLabelText("Upload succeed")).toBeDefined()
  );
});

test("should display an indicator when upload failed", async () => {
  (client.mutate as jest.Mock).mockImplementationOnce(() => {
    throw new Error("Error");
  });

  await renderModalAndImport(files.slice(0, 1));

  await waitFor(() =>
    expect(screen.getByLabelText("Error indicator")).toBeDefined()
  );
});

test("should display a loading indicator when file is uploading", async () => {
  await renderModalAndImport(files.slice(0, 1));

  await waitFor(() =>
    expect(screen.getByLabelText("Loading indicator")).toBeDefined()
  );
  await waitFor(() =>
    expect(screen.getByLabelText("Upload succeed")).toBeDefined()
  );
});

test("when the user drags invalid formats, only the valid pictures are uploaded", async () => {
  await renderModalAndImport();

  await waitFor(() =>
    expect(screen.getAllByLabelText("Upload succeed")).toHaveLength(2)
  );
});

test("should display the images name", async () => {
  await renderModalAndImport();

  expect(screen.getByText(/hello.png/i)).toBeDefined();
  expect(screen.getByText(/world.png/i)).toBeDefined();

  await ensuresUploadsAreFinished();
});

test("should display the rejected images name", async () => {
  await renderModalAndImport(files.slice(2, 3));

  expect(screen.getByText(/error.pdf/i)).toBeDefined();
  expect(screen.getByText(/file type must be jpeg, png or bmp/i)).toBeDefined();
});

test("should display the error description when a file could not be imported", async () => {
  await renderModalAndImport(files.slice(2, 3));

  expect(screen.getByText(/file type must be jpeg, png or bmp/i)).toBeDefined();

  userEvent.hover(screen.getByText(/file type must be jpeg, png or bmp/i));

  // We need to wait for the tooltip to be rendered before checking its content.
  await waitFor(() =>
    expect(screen.getByText(/File type must be/i)).toBeDefined()
  );
});

test("should not display the modal by default", async () => {
  act(() => {
    render(<ImportImagesModal />, {
      wrapper: Wrapper,
    });
  });

  expect(screen.queryByText(/Import/i)).not.toBeInTheDocument();
});

test("should call the onClose handler", async () => {
  const onClose = jest.fn();
  await renderModalAndImport([], { onClose });

  userEvent.click(screen.getByLabelText("Close"));

  expect(onClose).toHaveBeenCalled();
});

test("should not close the modal while file are uploading", async () => {
  await renderModalAndImport(files.slice(0, 1));

  expect(screen.getByLabelText("Loading indicator")).toBeDefined();
  expect(screen.getByLabelText("Close")).toBeDisabled();

  await ensuresUploadsAreFinished(1);
});

test("should display a start labeling button only when all the files are done", async () => {
  await renderModalAndImport(files);

  expect(
    screen.queryByRole("button", { name: /Start labeling/ })
  ).not.toBeInTheDocument();

  await waitFor(() =>
    expect(screen.getByRole("button", { name: /Start labeling/ })).toBeDefined()
  );
});
