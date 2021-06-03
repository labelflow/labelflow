import "fake-indexeddb/auto";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";

import { ImportImagesModal } from "../import-images-modal";

import { db } from "../../../../../../connectors/database";
import { client } from "../../../../../../connectors/apollo-client";
import { clearGetUrlFromImageIdMem } from "../../../../../../connectors/apollo-client/resolvers/image";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

/**
 * Mock the apollo client to avoid creating corrupted files that allows
 * us to identify a behaviour.
 */
jest.mock("../../../../../../connectors/apollo-client", () => {
  const original = jest.requireActual(
    "../../../../../../connectors/apollo-client"
  );

  return {
    client: { ...original.client, mutate: jest.fn(original.client.mutate) },
  };
});

/**
 * We bypass the structured clone algorithm as its current js implementation
 * as its current js implementation doesn't support blobs.
 * It might make our tests a bit different from what would actually happen
 * in a browser.
 */
jest.mock("fake-indexeddb/build/lib/structuredClone", () => ({
  default: (i: any) => i,
}));

// @ts-ignore
global.Image = class Image extends HTMLElement {
  width: number;

  height: number;

  constructor() {
    super();
    this.width = 42;
    this.height = 36;
    setTimeout(() => {
      this?.onload?.(new Event("onload")); // simulate success
    }, 100);
  }
};
// @ts-ignore
customElements.define("image-custom", global.Image);

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

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});

beforeEach(async () => {
  // Warning! The order matters for those 2 lines.
  // Otherwise, there is a failing race condition.
  await Promise.all(db.tables.map((table) => table.clear()));
  clearGetUrlFromImageIdMem();
});

function renderModalAndImport(filesToImport = files, props = {}) {
  render(<ImportImagesModal isOpen onClose={() => {}} {...props} />, {
    wrapper: Wrapper,
  });

  const input = screen.getByLabelText(/drop folders or images/i);
  return waitFor(() => userEvent.upload(input, filesToImport));
}

test("should display the number of valid images", async () => {
  await renderModalAndImport();

  await waitFor(() =>
    expect(screen.getByText(/Completed 2 of 2 items/i)).toBeDefined()
  );
  expect(
    screen.queryByLabelText(/drop folders or images/i)
  ).not.toBeInTheDocument();
});

test("should update completed number as valid images are uploaded", async () => {
  await renderModalAndImport();

  await waitFor(() =>
    expect(screen.getByText(/Completed 1 of 2 items/i)).toBeDefined()
  );

  await ensuresUploadsAreFinished();
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
  render(<ImportImagesModal />, {
    wrapper: Wrapper,
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

test("should clear the modal content when closed", async () => {
  await renderModalAndImport();

  await waitFor(() =>
    expect(screen.getAllByLabelText("Upload succeed")).toHaveLength(2)
  );

  await waitFor(() => {
    userEvent.click(screen.getByLabelText("Close"));
  });

  const input = screen.getByLabelText(/drop folders or images/i);
  await waitFor(() =>
    userEvent.upload(input, [
      new File(["Bonjour"], "bonjour.png", { type: "image/png" }),
    ])
  );

  await waitFor(() =>
    expect(screen.getByText(/Completed 1 of 1 items/i)).toBeDefined()
  );
});
