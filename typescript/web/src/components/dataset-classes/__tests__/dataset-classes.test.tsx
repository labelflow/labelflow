import { PropsWithChildren } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MockedProvider } from "@apollo/client/testing";
import { DatasetClasses } from "../dataset-classes";
import { theme } from "../../../theme";
import { getMockApolloLink } from "../../../utils/tests/mock-apollo";
import { APOLLO_MOCKS } from "../dataset-classes.fixtures";
import {
  MOCK_DATASET_SIMPLE,
  MOCK_DATASET_WITH_CLASSES,
} from "../../../utils/tests/data.fixtures";

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <MockedProvider link={getMockApolloLink(APOLLO_MOCKS)}>
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
    renderComponent(MOCK_DATASET_SIMPLE);
    await waitFor(() => {
      expect(screen.getByText("Classes (0)")).toBeDefined();
    });
  });

  it("Renders the dataset classes", async () => {
    renderComponent(MOCK_DATASET_WITH_CLASSES);
    await waitFor(() => {
      expect(
        screen.getByText(
          `Classes (${MOCK_DATASET_WITH_CLASSES.labelClasses.length})`
        )
      ).toBeDefined();
      MOCK_DATASET_WITH_CLASSES.labelClasses.forEach((labelClass) =>
        expect(screen.getByText(labelClass.name)).toBeDefined()
      );
    });
  });

  it("Renders the delete class modal", async () => {
    renderComponent(MOCK_DATASET_WITH_CLASSES);
    await waitFor(() =>
      fireEvent.click(screen.getAllByLabelText(/Delete class/i)[0])
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          `Delete Class ${MOCK_DATASET_WITH_CLASSES.labelClasses[0].name}`
        )
      ).toBeDefined()
    );
  });

  it("Renders the edit class modal", async () => {
    renderComponent(MOCK_DATASET_WITH_CLASSES);
    await waitFor(() =>
      fireEvent.click(screen.getAllByLabelText(/Edit class/i)[0])
    );
    await waitFor(() => expect(screen.getByText("Edit Class")).toBeDefined());
  });
});
