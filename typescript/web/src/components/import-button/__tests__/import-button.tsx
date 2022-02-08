/* eslint-disable import/first */
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import {
  mockUseQueryParams,
  mockNextRouter,
} from "../../../utils/router-mocks";
import { mockMatchMedia } from "../../../utils/mock-window";
import { BASIC_DATASET_DATA } from "../../../utils/tests/data.fixtures";

mockMatchMedia(jest);

mockUseQueryParams();
mockNextRouter({
  isReady: true,
  query: {
    datasetSlug: BASIC_DATASET_DATA.slug,
    workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
  },
});

import { ImportButton } from "../import-button";
import {
  getApolloMockLink,
  getApolloMockWrapper,
} from "../../../utils/tests/apollo-mock";
import { IMPORT_BUTTON_MOCKS } from "../import-button.fixtures";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

test("should clear the modal content when closed", async () => {
  const mockLink = getApolloMockLink(IMPORT_BUTTON_MOCKS);
  render(<ImportButton />, {
    wrapper: getApolloMockWrapper(mockLink),
  });

  userEvent.click(screen.getByLabelText("Add images"));

  const input = screen.getByLabelText(
    /Drop images and annotations or click to browse/i
  );
  await waitFor(() => userEvent.upload(input, files));

  await act(() => mockLink.waitForAllResponses());

  await waitFor(() =>
    expect(screen.getAllByLabelText("Upload succeed")).toHaveLength(2)
  );

  userEvent.click(screen.getByLabelText("Close"));

  await waitFor(() => {
    expect(screen.queryByText("Import")).not.toBeInTheDocument();
  });

  userEvent.click(screen.getByLabelText("Add images"));

  expect(
    screen.getByLabelText(/Drop images and annotations or click to browse/i)
  ).toBeDefined();

  expect(screen.queryByText(/Completed 2 of 2 items/i)).toBeNull();

  await waitFor(() =>
    userEvent.upload(
      screen.getByLabelText(/Drop images and annotations or click to browse/i),
      [new File(["Bonjour"], "bonjour.png", { type: "image/png" })]
    )
  );

  await waitFor(() =>
    expect(screen.getByText(/Completed 1 of 1 items/i)).toBeDefined()
  );
});
