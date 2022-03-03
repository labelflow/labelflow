import "@testing-library/jest-dom/extend-expect";
import { fireEvent, waitFor } from "@testing-library/react";
import {
  BASIC_LABEL_CLASS_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../../utils/fixtures";
import { mockWorkspace } from "../../../utils/tests/mock-workspace";

mockWorkspace({
  queryParams: { datasetSlug: BASIC_LABEL_CLASS_DATA.dataset.slug },
});

import {
  renderWithTestWrapper,
  RenderWithWrapperResult,
} from "../../../utils/tests";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "../dataset-classes.context";
import {
  APOLLO_MOCKS,
  CREATE_MANY_LABEL_CLASSES_MOCK,
} from "./add-classes-modal.fixtures";

jest.mock(
  "use-debounce",
  jest.fn(() => ({ useDebounce: (value: unknown) => [value] }))
);

import { AddClassesModal } from ".";

const onClose = jest.fn();

type TestComponentProps = Pick<
  DatasetClassesState,
  "editClass" | "datasetId" | "datasetSlug" | "labelClasses"
>;

const renderTest = async (
  props: Omit<TestComponentProps, "datasetSlug">
): Promise<RenderWithWrapperResult> => {
  const result = await renderWithTestWrapper(
    <DatasetClassesContext.Provider
      value={{
        ...({} as DatasetClassesState),
        datasetSlug: DEEP_DATASET_WITH_CLASSES_DATA.slug,
        labelClasses: DEEP_DATASET_WITH_CLASSES_DATA.labelClasses,
        ...props,
      }}
    >
      <AddClassesModal isOpen onClose={onClose} />
    </DatasetClassesContext.Provider>,
    { auth: { withWorkspaces: true }, apollo: { extraMocks: APOLLO_MOCKS } }
  );
  const { getByText } = result;
  await waitFor(() => expect(getByText("Add New Classes")).toBeDefined());
  return result;
};

describe(AddClassesModal, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders create modal with disabled create button by default", async () => {
    const { getByTestId, getByText } = await renderTest({});
    const button = getByTestId("create-classes-button");
    await waitFor(() => {
      expect(button).toHaveAttribute("disabled");
      expect(getByText(/0 classes/i)).toBeDefined();
    });
  });

  it("enables create button when class names list is not empty", async () => {
    const { getByTestId, getByText } = await renderTest({});
    const input = getByTestId("class-names-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "My new class" } });
    expect(input.value).toBe("My new class");
    const button = getByTestId("create-classes-button");
    await waitFor(() => {
      expect(button).not.toHaveAttribute("disabled");
      expect(getByText(/1 class/i)).toBeDefined();
    });
  });

  it("displays the amount of classes to be creatd", async () => {
    const { getByTestId, getByText } = await renderTest({});
    const input = getByTestId("class-names-input") as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: "My new class\nMy other new class" },
    });
    const button = getByTestId("create-classes-button");
    await waitFor(() => {
      expect(button).not.toHaveAttribute("disabled");
      expect(getByText(/2 classes/i)).toBeDefined();
    });
  });

  it("displays a warning message if two of the input names are identical", async () => {
    const { getByTestId, getByText } = await renderTest({});
    const input = getByTestId("class-names-input") as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: "ClassA\nClassB\nClassA" },
    });
    const button = getByTestId("create-classes-button");
    await waitFor(() => {
      expect(button).not.toHaveAttribute("disabled");
      expect(
        getByText(
          /2 classes will be created. Duplicate class names are ignored/i
        )
      ).toBeDefined();
    });
  });

  it("creates label classes when the form is submitted", async () => {
    const { getByTestId, getByText } = await renderTest({
      datasetId: BASIC_LABEL_CLASS_DATA.dataset.id,
      labelClasses: [],
    });
    const input = getByTestId("class-names-input") as HTMLInputElement;
    const button = getByTestId("create-classes-button");
    fireEvent.change(input, {
      target: {
        value: DEEP_DATASET_WITH_CLASSES_DATA.labelClasses
          .map((labelClass) => labelClass.name)
          .join("\n"),
      },
    });
    await waitFor(() => {
      expect(button).not.toHaveAttribute("disabled");
      expect(getByText(/3 classes/i)).toBeDefined();
    });
    fireEvent.click(button);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(CREATE_MANY_LABEL_CLASSES_MOCK.result).toHaveBeenCalled();
  });
});
