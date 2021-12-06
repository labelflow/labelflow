/* eslint-disable import/first */
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { v4 as uuid } from "uuid";
import { ApolloProvider, gql } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";

import userEvent from "@testing-library/user-event";
import { client } from "../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import {
  mockUseQueryParams,
  mockNextRouter,
} from "../../../utils/router-mocks";

mockUseQueryParams();
mockNextRouter({ query: { workspaceSlug: "local" } });

jest.mock(
  "use-debounce",
  jest.fn(() => ({ useDebounce: (value: unknown) => [value] }))
);

import { UpsertClassModal } from "../upsert-class-modal/upsert-class-modal";

setupTestsWithLocalDatabase();

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

const renderModal = (props: any = {}) => {
  return render(
    <UpsertClassModal
      isOpen
      datasetSlug="test"
      onClose={props.onClose}
      {...props}
    />,
    {
      wrapper: Wrapper,
    }
  );
};

const createTestDataset = async () => {
  const datasetName = "test";
  const {
    data: {
      createDataset: { id: datasetId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String) {
        createDataset(data: { name: $name, workspaceSlug: "local" }) {
          id
          name
          slug
        }
      }
    `,
    variables: { name: datasetName },
  });

  return datasetId;
};

const createLabelClassInTestDataset = async ({
  labelClassName,
  datasetId,
}: {
  labelClassName: string;
  datasetId: string;
}) => {
  const {
    data: {
      createLabelClass: { id: labelClassId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createLabelClassMutation(
        $id: ID!
        $name: String!
        $color: ColorHex!
        $datasetId: ID!
      ) {
        createLabelClass(
          data: { name: $name, id: $id, color: $color, datasetId: $datasetId }
        ) {
          id
          name
          color
        }
      }
    `,
    variables: {
      name: labelClassName,
      id: uuid(),
      color: "#F87171",
      datasetId,
    },
  });

  return labelClassId;
};

const fakeItem = {
  id: "0d2fe56c-a533-4c41-b197-9a5e1787d2bd",
  name: "fake name",
  color: "#F87171",
};

it("Should render edit modal when a class id is passed", async () => {
  renderModal({ item: fakeItem });
  expect(screen.getByText("Edit Class")).toBeDefined();
});

it("Should render create modal when a class id is not passed", async () => {
  renderModal();
  expect(screen.getByText("New Class")).toBeDefined();
});

it("Should render a modal with a prefilled input and an enabled button", () => {
  renderModal({ item: fakeItem });

  const input = screen.getByLabelText(/Class name input/i) as HTMLInputElement;
  const button = screen.getByLabelText(/Update/i);

  expect(input.value).toEqual(fakeItem.name);
  expect(button).not.toHaveAttribute("disabled");
});

it("Should enable update button when class name is not empty", async () => {
  renderModal({ item: fakeItem });
  const input = screen.getByLabelText(/Class name input/i) as HTMLInputElement;

  fireEvent.change(input, { target: { value: "My new class" } });
  expect(input.value).toBe("My new class");

  const button = screen.getByLabelText(/Update/i);
  await waitFor(() => {
    expect(button).not.toHaveAttribute("disabled");
  });
});

it("Should create a label class when the form is submitted", async () => {
  const onClose = jest.fn();
  const datasetId = await createTestDataset();

  renderModal({ datasetId, onClose });

  const className = "My new class";

  const input = screen.getByLabelText(/Class name input/i) as HTMLInputElement;
  const button = screen.getByLabelText(/Create/i);

  fireEvent.change(input, { target: { value: className } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  await act(async () => {
    const {
      data: { labelClasses },
    } = await client.query({
      query: gql`
        query getLabelClasses {
          labelClasses {
            id
            name
          }
        }
      `,
    });
    expect(labelClasses[0].name).toBe(className);
  });
});

it("Should display an error message if the label class already exists", async () => {
  const onClose = jest.fn();
  const labelClassName = "Horse";
  const datasetId = await createTestDataset();
  await createLabelClassInTestDataset({ datasetId, labelClassName });

  renderModal({ datasetId, onClose });
  const input = screen.getByLabelText(/class name input/i) as HTMLInputElement;

  fireEvent.change(input, { target: { value: labelClassName } });

  const button = screen.getByLabelText(/create/i);

  await waitFor(() => {
    expect(button).toHaveAttribute("disabled");
    expect(screen.getByText(/this name is already taken/i)).toBeDefined();
  });
});

it("Should update a dataset when the form is submitted", async () => {
  const onClose = jest.fn();
  const labelClassName = "Horse";
  const newLabelClassName = "Dog";
  const datasetId = await createTestDataset();
  const labelClassId = await createLabelClassInTestDataset({
    labelClassName,
    datasetId,
  });
  const item = {
    id: labelClassId,
    color: "#F87171",
  };

  renderModal({ item, datasetId, onClose });

  const input = screen.getByLabelText(/class name input/i) as HTMLInputElement;
  const button = screen.getByLabelText(/update/i);

  userEvent.click(input);
  userEvent.clear(input);
  userEvent.type(input, newLabelClassName);
  await waitFor(() => {
    expect(input.value).toBe(newLabelClassName);
  });

  userEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  await act(async () => {
    const {
      data: {
        labelClass: { name: newLabelClassNameFromQuery },
      },
    } = await client.query({
      query: gql`
        query getLabelClassById($id: ID) {
          labelClass(where: { id: $id }) {
            name
          }
        }
      `,
      variables: { id: labelClassId },
    });
    expect(newLabelClassNameFromQuery).toEqual(newLabelClassName);
  });
});
