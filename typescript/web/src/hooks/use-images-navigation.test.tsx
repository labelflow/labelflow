import { waitFor } from "@testing-library/react";
import { renderHook, WaitForValueToChange } from "@testing-library/react-hooks";
import { BASIC_DATASET_DATA } from "../utils/fixtures";
import {
  CURRENT_IMAGE_DATA,
  CURRENT_NOT_IN_IMAGES_MOCKS,
  IMAGE_1_DATA,
  IMAGE_2_DATA,
  IMAGE_IS_FIRST_MOCKS,
  IMAGE_IS_LAST_MOCKS,
  NO_IMAGES_MOCKS,
  NO_IMAGES_MOCKS_WITH_DELAY,
  THREE_IMAGES_MOCKS,
} from "./use-image-navigation.fixtures";

import { mockWorkspace } from "../utils/tests/mock-workspace";

mockWorkspace({
  workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
  queryParams: {
    datasetSlug: BASIC_DATASET_DATA.slug,
    imageId: CURRENT_IMAGE_DATA.id,
  },
});

import { ApolloMockResponses, createTestWrapper } from "../utils/tests";
import { useImagesNavigation } from "./use-images-navigation";

const renderTest = async (extraMocks: ApolloMockResponses) => {
  const { wrapper } = createTestWrapper({
    auth: { withWorkspaces: true, optional: true },
    apollo: { extraMocks },
  });
  const result = renderHook(() => useImagesNavigation(), { wrapper });
  await waitFor(() => expect(result.result.current).toBeDefined());
  const waitForValueToChange: WaitForValueToChange = (selector, options) =>
    result.waitForValueToChange(selector, { ...options, timeout: 5000 });
  return { ...result, waitForValueToChange };
};

describe(useImagesNavigation, () => {
  it("has an undefined currentImageIndex while loading", async () => {
    const { result } = await renderTest(NO_IMAGES_MOCKS_WITH_DELAY);
    expect(result.current.currentImageIndex).toEqual(undefined);
  });

  it("has a null currentImageIndex if the image can't be found", async () => {
    const { result, waitForValueToChange } = await renderTest(
      CURRENT_NOT_IN_IMAGES_MOCKS
    );
    await waitForValueToChange(() => result.current.currentImageIndex);
    expect(result.current.currentImageIndex).toEqual(null);
  });

  it("returns the array of images when loaded", async () => {
    const { result, waitForValueToChange } = await renderTest(
      THREE_IMAGES_MOCKS
    );
    await waitForValueToChange(() => result.current.images);
    expect(result.current.images?.length).toEqual(3);
  });

  it("returns the index of the selected image when loaded", async () => {
    const { result, waitForValueToChange } = await renderTest(
      THREE_IMAGES_MOCKS
    );
    await waitForValueToChange(() => result.current.currentImageIndex);
    expect(result.current.currentImageIndex).toEqual(1);
  });

  describe("Previous and Next ids", () => {
    it("has undefined previous and next ids while loading", async () => {
      const { result } = await renderTest(NO_IMAGES_MOCKS_WITH_DELAY);
      expect(result.current.previousImageId).toEqual(undefined);
      expect(result.current.nextImageId).toEqual(undefined);
    });

    it("has null previous and next ids when there is no image", async () => {
      const { result, waitForValueToChange } = await renderTest(
        NO_IMAGES_MOCKS
      );
      await waitForValueToChange(() => result.current.previousImageId);
      expect(result.current.previousImageId).toEqual(null);
      expect(result.current.nextImageId).toEqual(null);
    });

    it("has null previous and next ids when the selected image id can't be found in images", async () => {
      const { result, waitForValueToChange } = await renderTest(
        CURRENT_NOT_IN_IMAGES_MOCKS
      );
      await waitForValueToChange(() => result.current.previousImageId);
      expect(result.current.previousImageId).toEqual(null);
      expect(result.current.nextImageId).toEqual(null);
    });

    it("has a null previous id when the selected image is the first", async () => {
      const { result, waitForValueToChange } = await renderTest(
        IMAGE_IS_FIRST_MOCKS
      );
      await waitForValueToChange(() => result.current.previousImageId);
      expect(result.current.previousImageId).toEqual(null);
    });

    it("has null next id when the selected image is the last", async () => {
      const { result, waitForValueToChange } = await renderTest(
        IMAGE_IS_LAST_MOCKS
      );
      await waitForValueToChange(() => result.current.nextImageId);
      expect(result.current.nextImageId).toEqual(null);
    });

    it("has previous id as the first one when the selected image is the second", async () => {
      const { result, waitForValueToChange } = await renderTest(
        THREE_IMAGES_MOCKS
      );
      await waitForValueToChange(() => result.current.previousImageId);
      expect(result.current.previousImageId).toEqual(IMAGE_1_DATA.id);
    });

    it("has next id as the last one when the selected image is the second", async () => {
      const { result, waitForValueToChange } = await renderTest(
        THREE_IMAGES_MOCKS
      );
      await waitForValueToChange(() => result.current.nextImageId);
      expect(result.current.nextImageId).toEqual(IMAGE_2_DATA.id);
    });
  });
});
