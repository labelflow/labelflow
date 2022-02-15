/* eslint-disable import/order */
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { mockWorkspace } from "../../../utils/tests/mock-workspace";

mockWorkspace();

import { useRouter } from "next/router";
import {
  BASIC_IMAGE_DATA,
  DEEP_DATASET_WITH_IMAGES_DATA,
} from "../../../utils/fixtures";
import {
  ApolloMockResponses,
  renderWithTestWrapper,
} from "../../../utils/tests";
import { ImageNavigationTool } from "./image-navigation-tool";
import { APOLLO_MOCKS } from "./image-navigation-tool.fixtures";

const renderImageNavigationTool = () =>
  renderWithTestWrapper(<ImageNavigationTool />, {
    auth: { withWorkspaces: true },
    apollo: { extraMocks: APOLLO_MOCKS as ApolloMockResponses },
  });

const testNeighborImage = async (direction: "previous" | "next") => {
  const workspaceSlug = DEEP_DATASET_WITH_IMAGES_DATA.workspace.slug;
  const datasetSlug = DEEP_DATASET_WITH_IMAGES_DATA.slug;
  const imageId = DEEP_DATASET_WITH_IMAGES_DATA.images[1].id;
  const newImageId =
    DEEP_DATASET_WITH_IMAGES_DATA.images[direction === "next" ? 2 : 0].id;
  const mockedPush = jest.fn();
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { workspaceSlug, datasetSlug, imageId },
    push: mockedPush,
  }));
  const { container, getByRole } = await renderImageNavigationTool();
  await waitFor(() =>
    expect(
      getByRole("button", {
        name: direction === "next" ? /^Next image$/i : /^Previous image$/i,
      })
    ).toBeDefined()
  );
  userEvent.type(
    container,
    direction === "next" ? "{arrowright}" : "{arrowleft}"
  );
  expect(mockedPush).toHaveBeenCalledWith(
    `/${workspaceSlug}/datasets/${datasetSlug}/images/${newImageId}`
  );
};

describe(ImageNavigationTool, () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it("displays a dash and a zero when the image id isn't present/when the image list is empty", async () => {
    const { queryByDisplayValue, queryByText } =
      await renderImageNavigationTool();
    // We look for the "left" value, the one in the 'input`
    expect(queryByDisplayValue(/-/i)).toBeInTheDocument();
    // We look for the "right" value, the total count.
    await waitFor(() => expect(queryByText(/0/i)).toBeInTheDocument());
  });

  it("displays one when only one image in list", async () => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: {
        imageId: BASIC_IMAGE_DATA.id,
        datasetSlug: BASIC_IMAGE_DATA.dataset.slug,
        workspaceSlug: BASIC_IMAGE_DATA.dataset.workspace.slug,
      },
    }));
    const { queryByDisplayValue, queryByText } =
      await renderImageNavigationTool();
    await waitFor(() => expect(queryByDisplayValue(/1/i)).toBeInTheDocument());
    await waitFor(() => expect(queryByText(/1/i)).toBeInTheDocument());
  });

  it("selects previous image when the left arrow is pressed", () =>
    testNeighborImage("previous"));

  it("selects next image when the right arrow is pressed", () =>
    testNeighborImage("next"));
});
