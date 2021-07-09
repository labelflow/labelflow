import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import gql from "graphql-tag";
// eslint-disable-next-line import/no-extraneous-dependencies
import { mocked } from "ts-jest/utils";
import probe from "probe-image-size";
import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { ExportModal } from "..";
import { theme } from "../../../../theme";
import { client } from "../../../../connectors/apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";
import { LabelCreateInput } from "../../../../graphql-types.generated";

setupTestsWithLocalDatabase();

jest.mock("probe-image-size");
const mockedProbeSync = mocked(probe.sync);

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  </ApolloProvider>
);

const labelData = {
  x: 3.14,
  y: 42.0,
  height: 768,
  width: 362,
  geometry: {
    type: "Polygon",
    coordinates: [],
  },
};

const createLabel = (data: LabelCreateInput) => {
  return client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput!) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data,
    },
  });
};

const imageWidth = 500;
const imageHeight = 900;

const createImage = async (name: String) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage(
        $file: Upload!
        $name: String!
        $width: Int
        $height: Int
      ) {
        createImage(
          data: { name: $name, file: $file, width: $width, height: $height }
        ) {
          id
        }
      }
    `,
    variables: {
      file: new Blob(),
      name,
      width: imageWidth,
      height: imageHeight,
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
};

test("File should be downloaded when user clicks on Export to COCO", async () => {
  render(<ExportModal isOpen />, { wrapper });
  const anchorMocked = {
    href: "",
    click: jest.fn(),
  } as any;
  const createElementOriginal = document.createElement.bind(document);
  jest.spyOn(document, "createElement").mockImplementation((name, options) => {
    if (name === "a") {
      return anchorMocked;
    }
    return createElementOriginal(name, options);
  });

  userEvent.click(screen.getByText("Export to COCO"));

  await waitFor(() => expect(anchorMocked.click).toHaveBeenCalledTimes(1));
});

test("Export Modal should display the number of labels", async () => {
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
  const imageId = await createImage("an image");
  await createLabel({
    ...labelData,
    x: 1,
    imageId,
  });
  incrementMockedDate(1);
  await createLabel({
    ...labelData,
    x: 2,
    imageId,
  });

  render(<ExportModal isOpen />, { wrapper });

  await waitFor(() => {
    expect(screen.getByRole("banner").textContent).toEqual(
      expect.stringContaining("2 labels")
    );
  });
});
