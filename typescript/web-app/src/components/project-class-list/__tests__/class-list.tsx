import { PropsWithChildren } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider, gql } from "@apollo/client";
import { ClassesList } from "../class-list";
import { client } from "../../../connectors/apollo-client/schema-client";
import { theme } from "../../../theme";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

const createProject = async (name: string, projectId?: string | null) => {
  return client.mutate({
    mutation: gql`
      mutation createProject($projectId: String, $name: String!) {
        createProject(data: { id: $projectId, name: $name }) {
          id
          name
        }
      }
    `,
    variables: {
      name,
      projectId,
    },
  });
};

const createLabelClassInProject = async ({
  projectId,
  name,
  color,
}: {
  projectId: string;
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
        projectId,
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

describe("Project class list tests", () => {
  it("Renders if the project has no classes", async () => {
    const projectId = "myProjectId";
    await createProject("myProject", projectId);
    render(<ClassesList projectId={projectId} />, { wrapper });
    expect(screen.getByText("0 Classes")).toBeDefined();
  });

  it("Renders the project classes", async () => {
    const projectId = "myProjectId";
    await createProject("myProject", projectId);
    await createLabelClassInProject({
      projectId,
      name: "MyFirstClass",
      color: "blue",
    });
    await createLabelClassInProject({
      projectId,
      name: "MySecondClass",
      color: "white",
    });
    await createLabelClassInProject({
      projectId,
      name: "MyThirdClass",
      color: "red",
    });
    render(<ClassesList projectId={projectId} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("3 Classes")).toBeDefined();
      expect(screen.getByText("MyFirstClass")).toBeDefined();
      expect(screen.getByText("MySecondClass")).toBeDefined();
      expect(screen.getByText("MyThirdClass")).toBeDefined();
    });
  });

  it("Renders the class delete modal", async () => {
    const projectId = "myProjectId";
    await createProject("myProject", projectId);
    await createLabelClassInProject({
      projectId,
      name: "MyFirstClass",
      color: "blue",
    });
    render(<ClassesList projectId={projectId} />, { wrapper });

    await waitFor(() =>
      fireEvent.click(screen.getByLabelText(/Delete class/i))
    );
    await waitFor(() =>
      expect(screen.getByText("Delete Class MyFirstClass")).toBeDefined()
    );
  });
});
