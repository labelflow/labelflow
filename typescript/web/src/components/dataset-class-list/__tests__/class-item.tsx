import { PropsWithChildren } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import { ClassItem } from "../class-item";
import { client } from "../../../connectors/apollo-client/schema-client";
import { theme } from "../../../theme";

const classDefault = {
  color: "#F59E0B",
  name: "someClass",
  shortcut: "myShortcut",
  id: "myClassId",
};

// Mock apollo client to be able to test if the mutate function is called during the tests
jest.mock("../../../connectors/apollo-client/schema-client", () => {
  const original = jest.requireActual(
    "../../../connectors/apollo-client/schema-client"
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

const onClickEdit = jest.fn();
const onClickDelete = jest.fn();

describe("Dataset class list item tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Should display a class with the possibility to edit and delete it", () => {
    render(
      <ClassItem
        edit={false}
        onClickEdit={onClickEdit}
        datasetSlug="my-dataset-slug"
        onClickDelete={onClickDelete}
        {...classDefault}
      />,
      { wrapper }
    );
    expect(screen.getByText(/someClass/i)).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Edit class someClass name" })
    ).toBeDefined();
    expect(screen.getByRole("button", { name: "Delete class" })).toBeDefined();
    expect(screen.getByText(/myShortcut/i)).toBeDefined();
  });

  it("Should call function to edit name when edit button is clicked", async () => {
    render(
      <ClassItem
        edit={false}
        onClickEdit={onClickEdit}
        datasetSlug="my-dataset-slug"
        onClickDelete={onClickDelete}
        {...classDefault}
      />,
      { wrapper }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Edit class someClass name" })
    );
    expect(onClickEdit).toHaveBeenCalledWith("myClassId");
  });

  it("Should focus class name input when user enter in edition mode", async () => {
    const { rerender } = render(
      <ClassItem
        edit={false}
        onClickEdit={onClickEdit}
        datasetSlug="my-dataset-slug"
        onClickDelete={onClickDelete}
        {...classDefault}
      />,
      { wrapper }
    );

    rerender(
      <ClassItem
        edit
        onClickEdit={onClickEdit}
        datasetSlug="my-dataset-slug"
        onClickDelete={onClickDelete}
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
        onClickEdit={onClickEdit}
        datasetSlug="my-dataset-slug"
        onClickDelete={onClickDelete}
        {...classDefault}
      />,
      { wrapper }
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete class" }));
    expect(onClickDelete).toHaveBeenCalledWith("myClassId");
  });

  it("Should display clear and save options in edit mode", async () => {
    render(
      <ClassItem
        edit
        onClickEdit={onClickEdit}
        datasetSlug="my-dataset-slug"
        onClickDelete={onClickDelete}
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
        onClickEdit={onClickEdit}
        datasetSlug="my-dataset-slug"
        onClickDelete={onClickDelete}
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
        onClickEdit={onClickEdit}
        datasetSlug="my-dataset-slug"
        onClickDelete={onClickDelete}
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
