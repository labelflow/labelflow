/* eslint-disable import/first */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { ApolloProvider, gql } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { LabelCreateInput } from "@labelflow/graphql-types";
import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";
import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter({ query: { projectId: "mocked-project-id" } });

import { ExportModal } from "..";
import { theme } from "../../../../theme";
import { client } from "../../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  </ApolloProvider>
);

const createProject = async (
  projectId = "mocked-project-id",
  name = "test project"
) =>
  client.mutate({
    mutation: gql`
      mutation createProject($name: String!, $projectId: ID) {
        createProject(data: { name: $name, id: $projectId }) {
          id
        }
      }
    `,
    variables: { projectId, name },
  });

const labelData = {
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
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
        $projectId: ID!
      ) {
        createImage(
          data: {
            name: $name
            file: $file
            width: $width
            height: $height
            projectId: $projectId
          }
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
      projectId: "mocked-project-id",
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
  await createProject();
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
  await createProject();
  await createProject("second-project-id", "second-test-project");
  mockedProbeSync.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
  });
  const imageId = await createImage("an image");
  await createLabel({
    ...labelData,
    imageId,
  });
  incrementMockedDate(1);
  await createLabel({
    ...labelData,
    imageId,
  });

  render(<ExportModal isOpen />, { wrapper });

  await waitFor(() =>
    expect(screen.getByRole("banner").textContent).toEqual(
      expect.stringContaining("1 images and 2 labels")
    )
  );
});
