import { fireEvent } from "@storybook/testing-library";
import { render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComboBox } from "./combo-box";
import { TestItem, TestListItem, TEST_ITEMS } from "./combo-box.fixtures";

const TestComponent = () => (
  <ComboBox
    items={TEST_ITEMS}
    compareProp="label"
    item={TestItem}
    listItem={TestListItem}
    data-testid="combobox-trigger"
  />
);

const [{ label: TEST_ITEM_1_LABEL }, { label: TEST_ITEM_2_LABEL }] = TEST_ITEMS;

type RenderTestResult = RenderResult & {
  search: (text: string) => void;
  toggleOpen: () => void;
  trigger: HTMLElement;
};

const renderTest = (): RenderTestResult => {
  const result = render(<TestComponent />);
  const { getByTestId } = result;
  const trigger = getByTestId("combobox-trigger");
  const toggleOpen = () => fireEvent.click(trigger);
  const search = (text: string) => {
    const input = getByTestId("search-input-value");
    userEvent.type(input, text);
  };
  return { ...result, trigger, toggleOpen, search };
};

describe(ComboBox, () => {
  it("does not show elements if the combo box is closed", () => {
    const { getByText } = renderTest();
    expect(getByText(TEST_ITEM_1_LABEL)).toBeInTheDocument();
    expect(getByText(TEST_ITEM_2_LABEL)).toBeInTheDocument();
    expect(getByText(TEST_ITEM_1_LABEL)).not.toBeVisible();
    expect(getByText(TEST_ITEM_2_LABEL)).not.toBeVisible();
  });

  it("displays the popover when hovered", async () => {
    const { queryByText, trigger } = renderTest();
    expect(queryByText(/click to select a value/i)).not.toBeInTheDocument();
    fireEvent.mouseOver(trigger);
    await waitFor(() =>
      expect(queryByText(/click to select a value/i)).toBeInTheDocument()
    );
  });

  it("opens the combo box when clicked on", async () => {
    const { getByText, toggleOpen } = renderTest();
    expect(getByText(TEST_ITEM_1_LABEL)).toBeInTheDocument();
    expect(getByText(TEST_ITEM_1_LABEL)).not.toBeVisible();
    toggleOpen();
    await waitFor(() => expect(getByText(TEST_ITEM_1_LABEL)).toBeVisible());
  });

  it("filters items when input is typed in", async () => {
    const { queryByText, toggleOpen, search } = renderTest();
    toggleOpen();
    expect(queryByText(TEST_ITEM_2_LABEL)).toBeInTheDocument();
    search("1");
    expect(queryByText(TEST_ITEM_2_LABEL)).not.toBeInTheDocument();
  });

  it("clears input when closed", async () => {
    const { queryByText, toggleOpen, search } = renderTest();
    toggleOpen();
    search("abcdefg");
    toggleOpen();
    expect(queryByText(/abcdefg/i)).not.toBeInTheDocument();
  });
});
