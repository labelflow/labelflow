/* eslint-disable import/first */
import { renderHook } from "@testing-library/react-hooks";
import { mockNextRouter } from "../../utils/router-mocks";
import { BASIC_DATASET_DATA } from "../../utils/tests/data.fixtures";
import {
  CURRENT_IMAGE_DATA,
  CURRENT_NOT_IN_IMAGES_MOCKS,
  IMAGE_1_DATA,
  IMAGE_2_DATA,
  IMAGE_IS_FIRST_MOCKS,
  IMAGE_IS_LAST_MOCKS,
  NO_IMAGES_MOCKS,
  THREE_IMAGES_MOCKS,
} from "../use-image-navigation.fixtures";

mockNextRouter({
  isReady: true,
  query: {
    imageId: CURRENT_IMAGE_DATA.id,
    datasetSlug: BASIC_DATASET_DATA.slug,
    workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
  },
});

import { useImagesNavigation } from "../use-images-navigation";
import {
  ApolloMockResponses,
  getApolloMockLink,
  getApolloMockWrapper,
} from "../../utils/tests/apollo-mock";

const renderTest = (mocks: ApolloMockResponses) => {
  const link = getApolloMockLink(mocks);
  const wrapper = getApolloMockWrapper(link);
  return renderHook(() => useImagesNavigation(), { wrapper });
};

test("The currentImageIndex is undefined while loading", async () => {
  const { result } = renderTest(NO_IMAGES_MOCKS);

  expect(result.current.currentImageIndex).toEqual(undefined);
});

test("The currentImageIndex is null if it can't be found in the images", async () => {
  const { result, waitForValueToChange } = renderTest(
    CURRENT_NOT_IN_IMAGES_MOCKS
  );

  await waitForValueToChange(() => result.current.currentImageIndex);

  expect(result.current.currentImageIndex).toEqual(null);
});

test("It returns the array of images when loaded", async () => {
  const { result, waitForValueToChange } = renderTest(THREE_IMAGES_MOCKS);

  await waitForValueToChange(() => result.current.images);

  expect(result.current.images?.length).toEqual(3);
});

test("It returns the index of the selected image when loaded", async () => {
  const { result, waitForValueToChange } = renderTest(THREE_IMAGES_MOCKS);

  await waitForValueToChange(() => result.current.currentImageIndex);

  expect(result.current.currentImageIndex).toEqual(1);
});

describe("Previous and Next ids", () => {
  test("Previous and Next ids are undefined while loading", () => {
    const { result } = renderTest(NO_IMAGES_MOCKS);

    expect(result.current.previousImageId).toEqual(undefined);
    expect(result.current.nextImageId).toEqual(undefined);
  });

  test("Previous and Next ids are null when there is no image", async () => {
    const { result, waitForValueToChange } = renderTest(NO_IMAGES_MOCKS);

    await waitForValueToChange(() => result.current.previousImageId);

    expect(result.current.previousImageId).toEqual(null);
    expect(result.current.nextImageId).toEqual(null);
  });

  test("Previous and Next ids are null when the selected image id can't be found in images", async () => {
    const { result, waitForValueToChange } = renderTest(
      CURRENT_NOT_IN_IMAGES_MOCKS
    );

    await waitForValueToChange(() => result.current.previousImageId);

    expect(result.current.previousImageId).toEqual(null);
    expect(result.current.nextImageId).toEqual(null);
  });

  test("Previous id is null when the selected image is the first", async () => {
    const { result, waitForValueToChange } = renderTest(IMAGE_IS_FIRST_MOCKS);

    await waitForValueToChange(() => result.current.previousImageId);

    expect(result.current.previousImageId).toEqual(null);
  });

  test("Next id is null when the selected image is the last", async () => {
    const { result, waitForValueToChange } = renderTest(IMAGE_IS_LAST_MOCKS);

    await waitForValueToChange(() => result.current.nextImageId);

    expect(result.current.nextImageId).toEqual(null);
  });

  test("Previous id is the first one when the selected image is the second", async () => {
    const { result, waitForValueToChange } = renderTest(THREE_IMAGES_MOCKS);

    await waitForValueToChange(() => result.current.previousImageId);

    expect(result.current.previousImageId).toEqual(IMAGE_1_DATA.id);
  });

  test("Next id is the last one when the selected image is the second", async () => {
    const { result, waitForValueToChange } = renderTest(THREE_IMAGES_MOCKS);

    await waitForValueToChange(() => result.current.nextImageId);

    expect(result.current.nextImageId).toEqual(IMAGE_2_DATA.id);
  });
});
