/* eslint-disable import/first */
import { ApolloProvider, gql } from "@apollo/client";
import "@testing-library/jest-dom/extend-expect";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropsWithChildren } from "react";
import { v4 as uuid } from "uuid";
import { client } from "../../../connectors/apollo-client/schema-client";
import {
  mockNextRouter,
  mockUseQueryParams,
} from "../../../utils/router-mocks";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { CREATE_TEST_DATASET_MUTATION } from "../../../utils/tests/mutations";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "../dataset-classes.context";
import { GET_LABEL_CLASS_BY_ID_QUERY } from "../dataset-classes.query";
import { LabelClassWithShortcut } from "../types";

mockUseQueryParams();
mockNextRouter({ query: { workspaceSlug: "local" } });

jest.mock(
  "use-debounce",
  jest.fn(() => ({ useDebounce: (value: unknown) => [value] }))
);

import { UpsertClassModal } from "../upsert-class-modal";

setupTestsWithLocalDatabase();

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

const onClose = jest.fn();

type TestComponentProps = Pick<DatasetClassesState, "editClass" | "datasetId">;

const TEST_DATASET_SLUG = "test";

const renderTest = (props: TestComponentProps) => {
  return render(
    <DatasetClassesContext.Provider
      value={{
        ...({} as DatasetClassesState),
        datasetSlug: TEST_DATASET_SLUG,
        ...props,
      }}
    >
      <UpsertClassModal isOpen onClose={onClose} />
    </DatasetClassesContext.Provider>,
    { wrapper: Wrapper }
  );
};

const createTestDataset = async () => {
  const {
    data: {
      createDataset: { id: datasetId },
    },
  } = await client.mutate({
    mutation: CREATE_TEST_DATASET_MUTATION,
    variables: { name: TEST_DATASET_SLUG, workspaceSlug: "local" },
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

const TEST_LABEL_CLASS: LabelClassWithShortcut = {
  id: "0d2fe56c-a533-4c41-b197-9a5e1787d2bd",
  name: "fake name",
  color: "#F87171",
  index: 0,
  shortcut: "0",
  labelsAggregates: { totalCount: 1 },
};

describe("UpsertClassModal", () => {
  beforeEach(() => {
    onClose.mockReset();
  });

  it("renders edit modal when a class id is passed", async () => {
    renderTest({ editClass: TEST_LABEL_CLASS });
    expect(screen.getByText("Edit Class")).toBeDefined();
  });

  it("renders create modal when a class id is not passed", async () => {
    renderTest({});
    expect(screen.getByText("New Class")).toBeDefined();
  });

  it("renders a modal with a prefilled input and an enabled button", () => {
    renderTest({ editClass: TEST_LABEL_CLASS });

    const input = screen.getByLabelText(
      /Class name input/i
    ) as HTMLInputElement;
    const button = screen.getByLabelText(/Update/i);

    expect(input.value).toEqual(TEST_LABEL_CLASS.name);
    expect(button).not.toHaveAttribute("disabled");
  });

  it("enables update button when class name is not empty", async () => {
    renderTest({ editClass: TEST_LABEL_CLASS });
    const input = screen.getByLabelText(
      /Class name input/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "My new class" } });
    expect(input.value).toBe("My new class");

    const button = screen.getByLabelText(/Update/i);
    await waitFor(() => {
      expect(button).not.toHaveAttribute("disabled");
    });
  });

  it("creates a label class when the form is submitted", async () => {
    const datasetId = await createTestDataset();

    renderTest({ datasetId });

    const className = "My new class";

    const input = screen.getByLabelText(
      /Class name input/i
    ) as HTMLInputElement;
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

  it("displays an error message if the label class already exists", async () => {
    const labelClassName = "Horse";
    const datasetId = await createTestDataset();
    await createLabelClassInTestDataset({ datasetId, labelClassName });

    renderTest({ datasetId });
    const input = screen.getByLabelText(
      /class name input/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: labelClassName } });

    const button = screen.getByLabelText(/create/i);

    await waitFor(() => {
      expect(button).toHaveAttribute("disabled");
      expect(screen.getByText(/this name is already taken/i)).toBeDefined();
    });
  });

  it("updates a dataset when the form is submitted", async () => {
    const labelClassName = "Horse";
    const newLabelClassName = "Dog";
    const datasetId = await createTestDataset();
    const labelClassId = await createLabelClassInTestDataset({
      labelClassName,
      datasetId,
    });
    const editClass = {
      ...TEST_LABEL_CLASS,
      id: labelClassId,
      color: "#F87171",
    };
    renderTest({ editClass, datasetId });

    const input = screen.getByLabelText(
      /class name input/i
    ) as HTMLInputElement;
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
        query: GET_LABEL_CLASS_BY_ID_QUERY,
        variables: { id: labelClassId },
      });
      expect(newLabelClassNameFromQuery).toEqual(newLabelClassName);
    });
  });
});
