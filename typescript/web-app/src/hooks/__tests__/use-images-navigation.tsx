/* eslint-disable @typescript-eslint/no-use-before-define */
import { renderHook } from "@testing-library/react-hooks";
import gql from "graphql-tag";
import { ApolloProvider } from "@apollo/client";
import { useRouter } from "next/router";
import { setupTestsWithLocalDatabase } from "../../utils/setup-local-db-tests";
import { useImagesNavigation } from "../use-images-navigation";
import { client } from "../../connectors/apollo-client-schema";
import { incrementMockedDate } from "../../../../dev-utils/mockdate";

setupTestsWithLocalDatabase();

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({ query: { id: "toto" } })),
}));

const Wrapper = ({ children }: React.PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

test("The currentImageIndex is undefined while loading", async () => {
  await createImage("image1");
  await createImage("image2");
  await createImage("image3");
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
    query: { id: "fake-id" },
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
  (useRouter as jest.Mock).mockImplementation(() => ({ query: { id: id2 } }));
  const { result, waitForValueToChange } = renderHook(
    () => useImagesNavigation(),
    { wrapper: Wrapper }
  );

  await waitForValueToChange(() => result.current.currentImageIndex);

  expect(result.current.currentImageIndex).toEqual(1);
});

/* ----------- */
/*   Helpers   */
/* ----------- */

async function createImage(name: String) {
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
}
