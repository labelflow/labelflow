import "@testing-library/jest-dom/extend-expect";
import { act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isNil } from "lodash/fp";

import { BASIC_LABEL_CLASS_DATA } from "../../../utils/fixtures";
import { mockWorkspace } from "../../../utils/tests/mock-workspace";

mockWorkspace({
  queryParams: { datasetSlug: BASIC_LABEL_CLASS_DATA.dataset.slug },
});

import {
  CreateLabelClassMutation,
  CreateLabelClassMutationVariables,
  UpdateLabelClassNameMutation,
  UpdateLabelClassNameMutationVariables,
} from "../../../graphql-types";
import {
  ApolloMockResponse,
  ApolloMockResponses,
  renderWithTestWrapper,
  RenderWithWrapperResult,
} from "../../../utils/tests";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "../dataset-classes.context";
import {
  CREATE_LABEL_CLASS_DEFAULT_MOCK,
  GET_DATASET_WITH_LABEL_CLASSES_MOCK,
  GET_LABEL_CLASS_EXISTS_MOCK,
  getCreateLabelClassMockResult,
  getUpdateLabelClassNameMockResult,
  UPDATED_LABEL_CLASS_MOCK_NAME,
  UPDATE_LABEL_CLASS_NAME_MOCK,
} from "./upsert-class-modal.fixtures";

jest.mock(
  "use-debounce",
  jest.fn(() => ({ useDebounce: (value: unknown) => [value] }))
);

import { UpsertClassModal } from ".";

const onClose = jest.fn();

const CREATE_LABEL_CLASS_MOCK_WITH_JEST: ApolloMockResponse<
  CreateLabelClassMutation,
  CreateLabelClassMutationVariables
> = {
  ...CREATE_LABEL_CLASS_DEFAULT_MOCK,
  result: jest.fn(getCreateLabelClassMockResult),
};

const UPDATE_LABEL_CLASS_NAME_MOCK_WITH_JEST: ApolloMockResponse<
  UpdateLabelClassNameMutation,
  UpdateLabelClassNameMutationVariables
> = {
  ...UPDATE_LABEL_CLASS_NAME_MOCK,
  result: jest.fn(getUpdateLabelClassNameMockResult),
};

const APOLLO_MOCKS: ApolloMockResponses = [
  GET_DATASET_WITH_LABEL_CLASSES_MOCK,
  CREATE_LABEL_CLASS_MOCK_WITH_JEST,
  GET_LABEL_CLASS_EXISTS_MOCK,
  UPDATE_LABEL_CLASS_NAME_MOCK_WITH_JEST,
];

type TestComponentProps = Pick<
  DatasetClassesState,
  "editClass" | "datasetId" | "datasetSlug"
>;

const renderTest = async (
  props: Omit<TestComponentProps, "datasetSlug">
): Promise<RenderWithWrapperResult> => {
  const result = await renderWithTestWrapper(
    <DatasetClassesContext.Provider
      value={{
        ...({} as DatasetClassesState),
        datasetSlug: BASIC_LABEL_CLASS_DATA.dataset.slug,
        ...props,
      }}
    >
      <UpsertClassModal isOpen onClose={onClose} />
    </DatasetClassesContext.Provider>,
    { auth: { withWorkspaces: true }, apollo: { extraMocks: APOLLO_MOCKS } }
  );
  const title = `${isNil(props.editClass) ? "New" : "Edit"} Class`;
  const { getByText } = result;
  await waitFor(() => expect(getByText(title)).toBeDefined());
  return result;
};

describe(UpsertClassModal, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders edit modal when a class id is passed", async () => {
    await renderTest({ editClass: BASIC_LABEL_CLASS_DATA });
  });

  it("renders create modal when a class id is not passed", async () => {
    await renderTest({});
  });

  it("renders a modal with a prefilled input and a disabled button", async () => {
    const { getByLabelText } = await renderTest({
      editClass: BASIC_LABEL_CLASS_DATA,
    });
    const input = getByLabelText(/Class name input/i) as HTMLInputElement;
    const button = getByLabelText(/Update/i);
    expect(input.value).toEqual(BASIC_LABEL_CLASS_DATA.name);
    expect(button).toHaveAttribute("disabled");
  });

  it("enables update button when class name is not empty", async () => {
    const { getByLabelText } = await renderTest({
      editClass: BASIC_LABEL_CLASS_DATA,
    });
    const input = getByLabelText(/Class name input/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "My new class" } });
    expect(input.value).toBe("My new class");
    const button = getByLabelText(/Update/i);
    await waitFor(() => expect(button).not.toHaveAttribute("disabled"));
  });

  it("creates a label class when the form is submitted", async () => {
    const { getByLabelText } = await renderTest({
      datasetId: BASIC_LABEL_CLASS_DATA.dataset.id,
    });
    const input = getByLabelText(/Class name input/i) as HTMLInputElement;
    const button = getByLabelText(/Create/i);
    fireEvent.change(input, {
      target: { value: UPDATED_LABEL_CLASS_MOCK_NAME },
    });
    fireEvent.click(button);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(CREATE_LABEL_CLASS_MOCK_WITH_JEST.result).toHaveBeenCalled();
  });

  it("displays an error message if the label class already exists", async () => {
    const { getByLabelText, getByText, apolloMockLink } = await renderTest({
      datasetId: BASIC_LABEL_CLASS_DATA.dataset.id,
    });
    const input = getByLabelText(/class name input/i) as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: BASIC_LABEL_CLASS_DATA.name },
    });
    await act(() => apolloMockLink.waitForAllResponses());
    const button = getByLabelText(/create/i);
    await waitFor(() => {
      expect(button).toHaveAttribute("disabled");
      expect(getByText(/this name is already taken/i)).toBeDefined();
    });
  });

  it("updates a dataset when the form is submitted", async () => {
    const { getByLabelText, apolloMockLink } = await renderTest({
      editClass: BASIC_LABEL_CLASS_DATA,
    });
    const input = getByLabelText(/class name input/i) as HTMLInputElement;
    const button = getByLabelText(/update/i);
    userEvent.click(input);
    userEvent.clear(input);
    userEvent.type(input, UPDATED_LABEL_CLASS_MOCK_NAME);
    await waitFor(() =>
      expect(input.value).toBe(UPDATED_LABEL_CLASS_MOCK_NAME)
    );
    userEvent.click(button);
    await act(() => apolloMockLink.waitForAllResponses());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(UPDATE_LABEL_CLASS_NAME_MOCK_WITH_JEST.result).toHaveBeenCalled();
  });
});
