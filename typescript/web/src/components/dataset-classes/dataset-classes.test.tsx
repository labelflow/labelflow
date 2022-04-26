import { fireEvent, screen, waitFor } from "@testing-library/react";

import { mockWorkspace } from "../../utils/tests/mock-workspace";

mockWorkspace();

import {
  BASIC_DATASET_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../utils/fixtures";
import {
  renderWithTestWrapper,
  RenderWithWrapperResult,
} from "../../utils/tests";
import { DatasetClasses } from "./dataset-classes";
import { APOLLO_MOCKS } from "./dataset-classes.fixtures";

afterEach(() => {
  jest.clearAllMocks();
});

const renderComponent = async (dataset: {
  slug: string;
  workspace: { slug: string };
  labelClasses: { length: number };
}): Promise<RenderWithWrapperResult> => {
  const result = await renderWithTestWrapper(
    <DatasetClasses
      datasetSlug={dataset.slug}
      workspaceSlug={dataset.workspace.slug}
    />,
    { auth: { withWorkspaces: true }, apollo: { extraMocks: APOLLO_MOCKS } }
  );
  const { getByText } = result;
  await waitFor(() => {
    const element = getByText(`Classes (${dataset.labelClasses.length})`);
    expect(element).toBeDefined();
  });
  return result;
};

describe(DatasetClasses, () => {
  it("renders if the dataset has no classes", () =>
    renderComponent(BASIC_DATASET_DATA));

  it("renders the dataset classes", async () => {
    const { getByText } = await renderComponent(DEEP_DATASET_WITH_CLASSES_DATA);
    DEEP_DATASET_WITH_CLASSES_DATA.labelClasses.forEach((labelClass) =>
      expect(getByText(labelClass.name)).toBeDefined()
    );
  });

  it("renders the delete class modal", async () => {
    const { getByText, getAllByLabelText } = await renderComponent(
      DEEP_DATASET_WITH_CLASSES_DATA
    );
    fireEvent.click(getAllByLabelText(/Delete class/i)[0]);
    const labelClassName = DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[0].name;
    const deleteMessage = `Delete Class ${labelClassName}`;
    await waitFor(() => expect(getByText(deleteMessage)).toBeDefined());
  });

  it("renders the edit class modal", async () => {
    await renderComponent(DEEP_DATASET_WITH_CLASSES_DATA);
    fireEvent.click(screen.getAllByLabelText(/Edit class/i)[0]);
    await waitFor(() => expect(screen.getByText("Edit Class")).toBeDefined());
  });
});
