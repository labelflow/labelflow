import { PropsWithChildren } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MockedProvider } from "@apollo/client/testing";
import { DatasetClasses } from "../dataset-classes";
import { theme } from "../../../theme";
import { getApolloMockLink } from "../../../utils/tests/apollo-mock";
import { APOLLO_MOCKS } from "../dataset-classes.fixtures";
import {
  BASIC_DATASET_MOCK,
  DEEP_DATASET_MOCK_WITH_CLASSES,
} from "../../../utils/tests/data.fixtures";

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <MockedProvider link={getApolloMockLink(APOLLO_MOCKS)}>
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  </MockedProvider>
);

afterEach(() => {
  jest.clearAllMocks();
});

const renderComponent = (dataset: {
  slug: string;
  workspace: { slug: string };
}) => {
  return render(
    <DatasetClasses
      datasetSlug={dataset.slug}
      workspaceSlug={dataset.workspace.slug}
    />,
    {
      wrapper,
    }
  );
};

describe("Dataset class list tests", () => {
  it("Renders if the dataset has no classes", async () => {
    renderComponent(BASIC_DATASET_MOCK);
    await waitFor(() => {
      expect(screen.getByText("Classes (0)")).toBeDefined();
    });
  });

  it("Renders the dataset classes", async () => {
    renderComponent(DEEP_DATASET_MOCK_WITH_CLASSES);
    await waitFor(() => {
      expect(
        screen.getByText(
          `Classes (${DEEP_DATASET_MOCK_WITH_CLASSES.labelClasses.length})`
        )
      ).toBeDefined();
      DEEP_DATASET_MOCK_WITH_CLASSES.labelClasses.forEach((labelClass) =>
        expect(screen.getByText(labelClass.name)).toBeDefined()
      );
    });
  });

  it("Renders the delete class modal", async () => {
    renderComponent(DEEP_DATASET_MOCK_WITH_CLASSES);
    await waitFor(() =>
      fireEvent.click(screen.getAllByLabelText(/Delete class/i)[0])
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          `Delete Class ${DEEP_DATASET_MOCK_WITH_CLASSES.labelClasses[0].name}`
        )
      ).toBeDefined()
    );
  });

  it("Renders the edit class modal", async () => {
    renderComponent(DEEP_DATASET_MOCK_WITH_CLASSES);
    await waitFor(() =>
      fireEvent.click(screen.getAllByLabelText(/Edit class/i)[0])
    );
    await waitFor(() => expect(screen.getByText("Edit Class")).toBeDefined());
  });
});
