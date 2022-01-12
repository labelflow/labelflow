import { ApolloProvider } from "@apollo/client";
import { renderHook } from "@testing-library/react-hooks";
import { useRouter } from "next/router";
import { incrementMockedDate } from "../../../../dev-utils/mockdate";
import { client } from "../../connectors/apollo-client/schema-client";
import { processImage } from "../../connectors/repository/image-processing";
import { setupTestsWithLocalDatabase } from "../../utils/setup-local-db-tests";
import {
  createTestDatasetMutation,
  createTestImageMutation,
} from "../../utils/tests/mutations";
import { useImagesNavigation } from "../use-images-navigation";

setupTestsWithLocalDatabase();

jest.mock("../../connectors/repository/image-processing");
const mockedProcessImage = processImage as jest.Mock;

const testDatasetId = "mocked-dataset-id";

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    query: { datasetSlug: "test-dataset", workspaceSlug: "local" },
  })),
}));

async function createImage(name: String) {
  mockedProcessImage.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
  });
  const mutationResult = await client.mutate({
    mutation: createTestImageMutation,
    variables: {
      file: new Blob(),
      name,
      datasetId: testDatasetId,
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
}

beforeEach(async () => {
  await client.mutate({
    mutation: createTestDatasetMutation,
    variables: {
      name: "test dataset",
      datasetId: testDatasetId,
      workspaceSlug: "local",
    },
  });
});

const Wrapper = ({ children }: React.PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

test("The currentImageIndex is undefined while loading", async () => {
  const { result } = renderHook(() => useImagesNavigation(), {
    wrapper: Wrapper,
  });

  expect(result.current.currentImageIndex).toEqual(undefined);
});

test("The currentImageIndex is null if it can't be found in the images", async () => {
  await createImage("image1");
  await createImage("image2");
  await createImage("image3");
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: {
      imageId: "fake-id",
      datasetSlug: "test-dataset",
      workspaceSlug: "local",
    },
  }));
  const { result, waitForValueToChange } = renderHook(
    () => useImagesNavigation(),
    { wrapper: Wrapper }
  );

  await waitForValueToChange(() => result.current.currentImageIndex);

  expect(result.current.currentImageIndex).toEqual(null);
});

test("It returns the array of images when loaded", async () => {
  await createImage("image1");
  await createImage("image2");
  await createImage("image3");
  const { result, waitForValueToChange } = renderHook(
    () => useImagesNavigation(),
    { wrapper: Wrapper }
  );

  await waitForValueToChange(() => result.current.images);

  expect(result.current.images?.length).toEqual(3);
});

test("It returns the index of the selected image when loaded", async () => {
  await createImage("image1");
  incrementMockedDate(1);
  const id2 = await createImage("image2");
  incrementMockedDate(1);
  await createImage("image3");
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: {
      imageId: id2,
      datasetSlug: "test-dataset",
      workspaceSlug: "local",
    },
  }));
  const { result, waitForValueToChange } = renderHook(
    () => useImagesNavigation(),
    { wrapper: Wrapper }
  );

  await waitForValueToChange(() => result.current.currentImageIndex);

  expect(result.current.currentImageIndex).toEqual(1);
});

describe("Previous and Next ids", () => {
  test("Previous and Next ids are undefined while loading", () => {
    const { result } = renderHook(() => useImagesNavigation(), {
      wrapper: Wrapper,
    });

    expect(result.current.previousImageId).toEqual(undefined);
    expect(result.current.nextImageId).toEqual(undefined);
  });

  test("Previous and Next ids are null when there is no image", async () => {
    const { result, waitForValueToChange } = renderHook(
      () => useImagesNavigation(),
      {
        wrapper: Wrapper,
      }
    );

    await waitForValueToChange(() => result.current.previousImageId);

    expect(result.current.previousImageId).toEqual(null);
    expect(result.current.nextImageId).toEqual(null);
  });

  test("Previous and Next ids are null when the selected image id can't be found in images", async () => {
    await createImage("image1");
    await createImage("image2");
    await createImage("image3");
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: {
        imageId: "fake-id",
        datasetSlug: "test-dataset",
        workspaceSlug: "local",
      },
    }));
    const { result, waitForValueToChange } = renderHook(
      () => useImagesNavigation(),
      {
        wrapper: Wrapper,
      }
    );

    await waitForValueToChange(() => result.current.previousImageId);

    expect(result.current.previousImageId).toEqual(null);
    expect(result.current.nextImageId).toEqual(null);
  });

  test("Previous id is null when the selected image is the first", async () => {
    const id1 = await createImage("image1");
    incrementMockedDate(1);
    await createImage("image2");
    incrementMockedDate(1);
    await createImage("image3");
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: {
        imageId: id1,
        datasetSlug: "test-dataset",
        workspaceSlug: "local",
      },
    }));
    const { result, waitForValueToChange } = renderHook(
      () => useImagesNavigation(),
      {
        wrapper: Wrapper,
      }
    );

    await waitForValueToChange(() => result.current.previousImageId);

    expect(result.current.previousImageId).toEqual(null);
  });

  test("Next id is null when the selected image is the last", async () => {
    await createImage("image1");
    incrementMockedDate(1);
    await createImage("image2");
    incrementMockedDate(1);
    const id3 = await createImage("image3");
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: {
        imageId: id3,
        datasetSlug: "test-dataset",
        workspaceSlug: "local",
      },
    }));
    const { result, waitForValueToChange } = renderHook(
      () => useImagesNavigation(),
      {
        wrapper: Wrapper,
      }
    );

    await waitForValueToChange(() => result.current.nextImageId);

    expect(result.current.nextImageId).toEqual(null);
  });

  test("Previous id is the first one when the selected image is the second", async () => {
    const id1 = await createImage("image1");
    incrementMockedDate(1);
    const id2 = await createImage("image2");
    incrementMockedDate(1);
    await createImage("image3");
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: {
        imageId: id2,
        datasetSlug: "test-dataset",
        workspaceSlug: "local",
      },
    }));
    const { result, waitForValueToChange } = renderHook(
      () => useImagesNavigation(),
      {
        wrapper: Wrapper,
      }
    );

    await waitForValueToChange(() => result.current.previousImageId);

    expect(result.current.previousImageId).toEqual(id1);
  });

  test("Next id is the last one when the selected image is the second", async () => {
    await createImage("image1");
    incrementMockedDate(1);
    const id2 = await createImage("image2");
    incrementMockedDate(1);
    const id3 = await createImage("image3");
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: {
        imageId: id2,
        datasetSlug: "test-dataset",
        workspaceSlug: "local",
      },
    }));
    const { result, waitForValueToChange } = renderHook(
      () => useImagesNavigation(),
      {
        wrapper: Wrapper,
      }
    );

    await waitForValueToChange(() => result.current.nextImageId);

    expect(result.current.nextImageId).toEqual(id3);
  });
});
