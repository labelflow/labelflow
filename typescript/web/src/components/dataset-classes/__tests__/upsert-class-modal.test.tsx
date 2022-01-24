/* eslint-disable import/first */
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getMockApolloWrapper } from "../../../utils/tests/mock-apollo";
import {
  mockNextRouter,
  mockUseQueryParams,
} from "../../../utils/router-mocks";
import { MOCK_LABEL_CLASS_SIMPLE } from "../../../utils/tests/data.fixtures";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "../dataset-classes.context";
import {
  APOLLO_MOCKS,
  MOCK_LABEL_CLASS_UPDATED_NAME,
} from "../upsert-class-modal/upsert-class-modal.fixtures";

mockUseQueryParams();
mockNextRouter({
  query: { workspaceSlug: MOCK_LABEL_CLASS_SIMPLE.dataset.workspace.slug },
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
    { wrapper: getMockApolloWrapper(APOLLO_MOCKS) }
  );
};

describe("UpsertClassModal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders edit modal when a class id is passed", async () => {
    renderTest({
      editClass: MOCK_LABEL_CLASS_SIMPLE,
      datasetSlug: MOCK_LABEL_CLASS_SIMPLE.dataset.slug,
    });
    expect(screen.getByText("Edit Class")).toBeDefined();
  });

  it("renders create modal when a class id is not passed", async () => {
    renderTest({ datasetSlug: MOCK_LABEL_CLASS_SIMPLE.dataset.slug });
    expect(screen.getByText("New Class")).toBeDefined();
  });

  it("renders a modal with a prefilled input and an enabled button", () => {
    renderTest({
      editClass: MOCK_LABEL_CLASS_SIMPLE,
      datasetSlug: MOCK_LABEL_CLASS_SIMPLE.dataset.slug,
    });

    const input = screen.getByLabelText(
      /Class name input/i
    ) as HTMLInputElement;
    const button = screen.getByLabelText(/Update/i);

    expect(input.value).toEqual(MOCK_LABEL_CLASS_SIMPLE.name);
    expect(button).not.toHaveAttribute("disabled");
  });

  it("enables update button when class name is not empty", async () => {
    renderTest({
      editClass: MOCK_LABEL_CLASS_SIMPLE,
      datasetSlug: MOCK_LABEL_CLASS_SIMPLE.dataset.slug,
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
      datasetId: MOCK_LABEL_CLASS_SIMPLE.dataset.id,
      datasetSlug: MOCK_LABEL_CLASS_SIMPLE.dataset.slug,
    });

    const input = screen.getByLabelText(
      /Class name input/i
    ) as HTMLInputElement;
    const button = screen.getByLabelText(/Create/i);

    fireEvent.change(input, {
      target: { value: MOCK_LABEL_CLASS_UPDATED_NAME },
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });

    expect(APOLLO_MOCKS.createLabelClassDefault.result).toHaveBeenCalled();
  });

  it("displays an error message if the label class already exists", async () => {
    renderTest({
      datasetId: MOCK_LABEL_CLASS_SIMPLE.dataset.id,
      datasetSlug: MOCK_LABEL_CLASS_SIMPLE.dataset.slug,
    });
    const input = screen.getByLabelText(
      /class name input/i
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: MOCK_LABEL_CLASS_SIMPLE.name },
    });

    const button = screen.getByLabelText(/create/i);

    await waitFor(() => {
      expect(button).toHaveAttribute("disabled");
      expect(screen.getByText(/this name is already taken/i)).toBeDefined();
    });
  });

  it("updates a dataset when the form is submitted", async () => {
    renderTest({
      editClass: MOCK_LABEL_CLASS_SIMPLE,
      datasetSlug: MOCK_LABEL_CLASS_SIMPLE.dataset.slug,
    });

    const input = screen.getByLabelText(
      /class name input/i
    ) as HTMLInputElement;
    const button = screen.getByLabelText(/update/i);

    userEvent.click(input);
    userEvent.clear(input);
    userEvent.type(input, MOCK_LABEL_CLASS_UPDATED_NAME);
    await waitFor(() => {
      expect(input.value).toBe(MOCK_LABEL_CLASS_UPDATED_NAME);
    });

    userEvent.click(button);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });

    expect(APOLLO_MOCKS.updateLabelClassName.result).toHaveBeenCalled();
  });
});
