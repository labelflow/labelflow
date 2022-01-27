/* eslint-disable import/first */
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getApolloMockWrapper } from "../../../utils/tests/apollo-mock";
import {
  mockNextRouter,
  mockUseQueryParams,
} from "../../../utils/router-mocks";
import { BASIC_LABEL_CLASS_MOCK } from "../../../utils/tests/data.fixtures";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "../dataset-classes.context";
import {
  APOLLO_MOCKS,
  CREATE_LABEL_CLASS_DEFAULT_MOCK,
  UPDATED_LABEL_CLASS_MOCK_NAME,
  UPDATE_LABEL_CLASS_NAME_MOCK,
} from "../upsert-class-modal/upsert-class-modal.fixtures";

mockUseQueryParams();
mockNextRouter({
  query: { workspaceSlug: BASIC_LABEL_CLASS_MOCK.dataset.workspace.slug },
});

jest.mock(
  "use-debounce",
  jest.fn(() => ({ useDebounce: (value: unknown) => [value] }))
);

import { UpsertClassModal } from "../upsert-class-modal";

const onClose = jest.fn();

type TestComponentProps = Pick<
  DatasetClassesState,
  "editClass" | "datasetId" | "datasetSlug"
>;

const renderTest = (props: TestComponentProps) => {
  return render(
    <DatasetClassesContext.Provider
      value={{
        ...({} as DatasetClassesState),
        ...props,
      }}
    >
      <UpsertClassModal isOpen onClose={onClose} />
    </DatasetClassesContext.Provider>,
    { wrapper: getApolloMockWrapper(APOLLO_MOCKS) }
  );
};

describe("UpsertClassModal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders edit modal when a class id is passed", async () => {
    renderTest({
      editClass: BASIC_LABEL_CLASS_MOCK,
      datasetSlug: BASIC_LABEL_CLASS_MOCK.dataset.slug,
    });
    expect(screen.getByText("Edit Class")).toBeDefined();
  });

  it("renders create modal when a class id is not passed", async () => {
    renderTest({ datasetSlug: BASIC_LABEL_CLASS_MOCK.dataset.slug });
    expect(screen.getByText("New Class")).toBeDefined();
  });

  it("renders a modal with a prefilled input and an enabled button", () => {
    renderTest({
      editClass: BASIC_LABEL_CLASS_MOCK,
      datasetSlug: BASIC_LABEL_CLASS_MOCK.dataset.slug,
    });

    const input = screen.getByLabelText(
      /Class name input/i
    ) as HTMLInputElement;
    const button = screen.getByLabelText(/Update/i);

    expect(input.value).toEqual(BASIC_LABEL_CLASS_MOCK.name);
    expect(button).not.toHaveAttribute("disabled");
  });

  it("enables update button when class name is not empty", async () => {
    renderTest({
      editClass: BASIC_LABEL_CLASS_MOCK,
      datasetSlug: BASIC_LABEL_CLASS_MOCK.dataset.slug,
    });
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
    renderTest({
      datasetId: BASIC_LABEL_CLASS_MOCK.dataset.id,
      datasetSlug: BASIC_LABEL_CLASS_MOCK.dataset.slug,
    });

    const input = screen.getByLabelText(
      /Class name input/i
    ) as HTMLInputElement;
    const button = screen.getByLabelText(/Create/i);

    fireEvent.change(input, {
      target: { value: UPDATED_LABEL_CLASS_MOCK_NAME },
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });

    expect(CREATE_LABEL_CLASS_DEFAULT_MOCK.result).toHaveBeenCalled();
  });

  it("displays an error message if the label class already exists", async () => {
    renderTest({
      datasetId: BASIC_LABEL_CLASS_MOCK.dataset.id,
      datasetSlug: BASIC_LABEL_CLASS_MOCK.dataset.slug,
    });
    const input = screen.getByLabelText(
      /class name input/i
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: BASIC_LABEL_CLASS_MOCK.name },
    });

    const button = screen.getByLabelText(/create/i);

    await waitFor(() => {
      expect(button).toHaveAttribute("disabled");
      expect(screen.getByText(/this name is already taken/i)).toBeDefined();
    });
  });

  it("updates a dataset when the form is submitted", async () => {
    renderTest({
      editClass: BASIC_LABEL_CLASS_MOCK,
      datasetSlug: BASIC_LABEL_CLASS_MOCK.dataset.slug,
    });

    const input = screen.getByLabelText(
      /class name input/i
    ) as HTMLInputElement;
    const button = screen.getByLabelText(/update/i);

    userEvent.click(input);
    userEvent.clear(input);
    userEvent.type(input, UPDATED_LABEL_CLASS_MOCK_NAME);
    await waitFor(() => {
      expect(input.value).toBe(UPDATED_LABEL_CLASS_MOCK_NAME);
    });

    userEvent.click(button);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });

    expect(UPDATE_LABEL_CLASS_NAME_MOCK.result).toHaveBeenCalled();
  });
});
