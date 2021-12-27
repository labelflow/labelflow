import { PropsWithChildren } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider, gql } from "@apollo/client";
import { LabelClasses } from "../label-classes";
import { client } from "../../../connectors/apollo-client/schema-client";
import { theme } from "../../../theme";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

const createDataset = async (name: string, datasetId?: string | null) => {
  return await client.mutate({
    mutation: gql`
      mutation createDataset($datasetId: String, $name: String!) {
        createDataset(
          data: { id: $datasetId, name: $name, workspaceSlug: "local" }
        ) {
          id
          name
        }
      }
    `,
    variables: {
      name,
      datasetId,
    },
  });
};

const createLabelClassInDataset = async ({
  datasetId,
  name,
  color,
}: {
  datasetId: string;
  name: string;
  color: string;
}) => {
  await client.mutate({
    mutation: gql`
      mutation createLabelClass($data: LabelClassCreateInput) {
        createLabelClass(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        name,
        color,
        datasetId,
      },
    },
  });
};

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  </ApolloProvider>
);

describe("Dataset class list tests", () => {
  it("Renders if the dataset has no classes", async () => {
    const datasetId = "myDatasetId";
    await createDataset("myDataset", datasetId);
    render(<LabelClasses datasetSlug="mydataset" workspaceSlug="local" />, {
      wrapper,
    });
    await waitFor(() => {
      expect(screen.getByText("Classes (0)")).toBeDefined();
    });
  });

  it("Renders the dataset classes", async () => {
    const datasetId = "myDatasetId";
    await createDataset("myDataset", datasetId);
    await createLabelClassInDataset({
      datasetId,
      name: "MyFirstClass",
      color: "blue",
    });
    await createLabelClassInDataset({
      datasetId,
      name: "MySecondClass",
      color: "white",
    });
    await createLabelClassInDataset({
      datasetId,
      name: "MyThirdClass",
      color: "red",
    });
    render(<LabelClasses datasetSlug="mydataset" workspaceSlug="local" />, {
      wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("Classes (3)")).toBeDefined();
      expect(screen.getByText("MyFirstClass")).toBeDefined();
      expect(screen.getByText("MySecondClass")).toBeDefined();
      expect(screen.getByText("MyThirdClass")).toBeDefined();
    });
  });

  it("Renders the delete class modal", async () => {
    const datasetId = "myDatasetId";
    await createDataset("myDataset", datasetId);
    await createLabelClassInDataset({
      datasetId,
      name: "MyFirstClass",
      color: "blue",
    });
    render(<LabelClasses datasetSlug="mydataset" workspaceSlug="local" />, {
      wrapper,
    });

    await waitFor(() =>
      fireEvent.click(screen.getByLabelText(/Delete class/i))
    );
    await waitFor(() =>
      expect(screen.getByText("Delete Class MyFirstClass")).toBeDefined()
    );
  });

  it("Renders the edit class modal", async () => {
    const datasetId = "myDatasetId";
    await createDataset("myDataset", datasetId);
    await createLabelClassInDataset({
      datasetId,
      name: "MyFirstClass",
      color: "blue",
    });
    render(<LabelClasses datasetSlug="mydataset" workspaceSlug="local" />, {
      wrapper,
    });

    await waitFor(() => fireEvent.click(screen.getByLabelText(/Edit class/i)));
    await waitFor(() => expect(screen.getByText("Edit Class")).toBeDefined());
  });
});
