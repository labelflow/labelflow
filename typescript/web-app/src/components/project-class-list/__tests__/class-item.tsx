import { PropsWithChildren } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import { ClassItem } from "../class-item";
import { client } from "../../../connectors/apollo-client-schema";
import { theme } from "../../../theme";

const classDefault = {
  color: "#F59E0B",
  name: "someClass",
  shortcut: "myShortcut",
  id: "myClassId",
};

// Mock apollo client to be able to test if the mutate function is called during the tests
jest.mock("../../../connectors/apollo-client-schema", () => {
  const original = jest.requireActual(
    "../../../connectors/apollo-client-schema"
  );

  return {
    client: { ...original.client, mutate: jest.fn(original.client.mutate) },
  };
});

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  </ApolloProvider>
);

const setEditClassId = jest.fn();
const setDeleteClassId = jest.fn();

describe("Project class list item tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Should display a class with the possibility to edit and delete it", () => {
    render(
      <ClassItem
        edit={false}
        setEditClassId={setEditClassId}
        projectId="myProjectId"
        setDeleteClassId={setDeleteClassId}
        {...classDefault}
      />,
      { wrapper }
    );
    expect(screen.getByText(/someClass/i)).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Edit class someClass name" })
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Delete class someClass" })
    ).toBeDefined();
    expect(screen.getByText(/myShortcut/i)).toBeDefined();
  });

  it("Should call function to edit name when edit button is clicked", async () => {
    render(
      <ClassItem
        edit={false}
        setEditClassId={setEditClassId}
        projectId="myProjectId"
        setDeleteClassId={setDeleteClassId}
        {...classDefault}
      />,
      { wrapper }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Edit class someClass name" })
    );
    expect(setEditClassId).toHaveBeenCalledWith("myClassId");
  });

  it("Should focus class name input when user enter in edition mode", async () => {
    const { rerender } = render(
      <ClassItem
        edit={false}
        setEditClassId={setEditClassId}
        projectId="myProjectId"
        setDeleteClassId={setDeleteClassId}
        {...classDefault}
      />,
      { wrapper }
    );

    rerender(
      <ClassItem
        edit
        setEditClassId={setEditClassId}
        projectId="myProjectId"
        setDeleteClassId={setDeleteClassId}
        {...classDefault}
      />
    );

    await waitFor(() =>
      expect(screen.getByLabelText("Class name input")).toHaveFocus()
    );
  });

  it("Should call function to open delete class modal when delete button is clicked", async () => {
    render(
      <ClassItem
        edit={false}
        setEditClassId={setEditClassId}
        projectId="myProjectId"
        setDeleteClassId={setDeleteClassId}
        {...classDefault}
      />,
      { wrapper }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Delete class someClass" })
    );
    expect(setDeleteClassId).toHaveBeenCalledWith("myClassId");
  });

  it("Should display clear and save options in edit mode", async () => {
    render(
      <ClassItem
        edit
        setEditClassId={setEditClassId}
        projectId="myProjectId"
        setDeleteClassId={setDeleteClassId}
        {...classDefault}
      />,
      { wrapper }
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Save" })).toBeDefined()
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cancel" })).toBeDefined()
    );
  });

  it("Should call update label mutation with new name when clicking on save button", async () => {
    render(
      <ClassItem
        edit
        setEditClassId={setEditClassId}
        projectId="myProjectId"
        setDeleteClassId={setDeleteClassId}
        {...classDefault}
      />,
      { wrapper }
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Class name input" }),
      {
        target: { value: "NewClassName" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(client.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { id: "myClassId", name: "NewClassName" },
      })
    );
  });

  it("Should cancel name edition when clicking on cancel", async () => {
    render(
      <ClassItem
        edit
        setEditClassId={setEditClassId}
        projectId="myProjectId"
        setDeleteClassId={setDeleteClassId}
        {...classDefault}
      />,
      { wrapper }
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Class name input" }),
      {
        target: { value: "NewClassName" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(client.mutate).toHaveBeenCalledTimes(0);
  });
});
