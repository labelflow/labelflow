/* eslint-disable import/first */
/* eslint-disable import/order */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { getApolloMockWrapper } from "../../../../utils/tests/apollo-mock";
import {
  BASIC_IMAGE_DATA,
  DEEP_DATASET_WITH_IMAGES_DATA,
} from "../../../../utils/tests/data.fixtures";
import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter({ query: { workspaceSlug: "local" } });

import { useRouter } from "next/router";
import { ImageNavigationTool } from "../image-navigation-tool";
import { APOLLO_MOCKS } from "../image-navigation-tool.fixtures";

const renderImageNavigationTool = () =>
  render(<ImageNavigationTool />, {
    wrapper: getApolloMockWrapper(APOLLO_MOCKS),
  });

beforeEach(async () => {
  jest.clearAllMocks();
});

test("should display a dash and a zero when the image id isn't present/when the image list is empty", async () => {
  renderImageNavigationTool();
  // We look for the "left" value, the one in the 'input`
  expect(screen.queryByDisplayValue(/-/i)).toBeInTheDocument();
  // We look for the "right" value, the total count.
  await waitFor(() => expect(screen.queryByText(/0/i)).toBeInTheDocument());
});

test("should display one when only one image in list", async () => {
  // const imageId = await createImage("testImage");
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: {
      imageId: BASIC_IMAGE_DATA.id,
      datasetSlug: BASIC_IMAGE_DATA.dataset.slug,
      workspaceSlug: BASIC_IMAGE_DATA.dataset.workspace.slug,
    },
  }));
  renderImageNavigationTool();
  await waitFor(() =>
    expect(screen.queryByDisplayValue(/1/i)).toBeInTheDocument()
  );
  await waitFor(() => expect(screen.queryByText(/1/i)).toBeInTheDocument());
});

const testNextPrevImage = (direction: "previous" | "next") => async () => {
  const workspaceSlug = DEEP_DATASET_WITH_IMAGES_DATA.workspace.slug;
  const datasetSlug = DEEP_DATASET_WITH_IMAGES_DATA.slug;
  const imageId = DEEP_DATASET_WITH_IMAGES_DATA.images[1].id;
  const newImageId =
    DEEP_DATASET_WITH_IMAGES_DATA.images[direction === "next" ? 2 : 0].id;
  const mockedPush = jest.fn();
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: {
      imageId,
      datasetSlug,
      workspaceSlug,
    },
    push: mockedPush,
  }));
  const { container } = renderImageNavigationTool();
  await waitFor(() =>
    expect(
      screen.getByRole("button", {
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

test(
  "should select previous image when the left arrow is pressed",
  testNextPrevImage("previous")
);

test(
  "should select next image when the right arrow is pressed",
  testNextPrevImage("next")
);
