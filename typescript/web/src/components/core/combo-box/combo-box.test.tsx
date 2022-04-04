import { Flex, HStack, Text } from "@chakra-ui/react";
import { fireEvent } from "@storybook/testing-library";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComboBox } from "./combo-box";

type ITEM = {
  id: string;
  name: string;
};

const ITEMS: ITEM[] = [
  {
    id: "1",
    name: "Test item 1",
  },
  {
    id: "2",
    name: "Test item 2",
  },
];

const ComboBoxItem = ({ name }: { name: string }) => (
  <HStack>
    <Text>{name}</Text>
  </HStack>
);

const ComboBoxListItem = (item: ITEM) => {
  const { name, id } = item;
  return (
    <Flex direction="column" data-testid={`ai-assistant-item-${id}`}>
      <ComboBoxItem name={name} />
    </Flex>
  );
};

const combo = () => (
  <ComboBox
    items={ITEMS}
    compareProp="name"
    item={ComboBoxItem}
    listItem={ComboBoxListItem}
    data-testid="combobox-trigger"
  />
);

describe("ComboBox", () => {
  it("does not show elements if the combo box is closed", () => {
    const { getByText } = render(combo());
    expect(getByText(/test item 1/i)).toBeInTheDocument();
    expect(getByText(/test item 2/i)).toBeInTheDocument();
    expect(getByText(/test item 1/i)).not.toBeVisible();
    expect(getByText(/test item 2/i)).not.toBeVisible();
  });

  it("displays the popover when hovered", async () => {
    const { queryByText, getByTestId } = render(combo());
    expect(queryByText(/click to select a value/i)).not.toBeInTheDocument();
    const trigger = getByTestId("combobox-trigger");
    fireEvent.mouseOver(trigger);
    await waitFor(
      () => expect(queryByText(/click to select a value/i)).toBeInTheDocument(),
      {
        timeout: 1000,
      }
    );
  });

  it("opens the combo box when clicked on", async () => {
    const { getByText, getByTestId } = render(combo());
    expect(getByText(/test item 1/i)).toBeInTheDocument();
    expect(getByText(/test item 1/i)).not.toBeVisible();
    const trigger = getByTestId("combobox-trigger");
    fireEvent.click(trigger);
    await waitFor(() => expect(getByText(/test item 1/i)).toBeVisible(), {
      timeout: 1000,
    });
  });

  it("filters items when input is typed in", async () => {
    const { queryByText, getByTestId } = render(combo());
    const trigger = getByTestId("combobox-trigger");
    fireEvent.click(trigger);
    expect(queryByText(/test item 2/i)).toBeInTheDocument();
    const input = getByTestId("search-input-value");
    userEvent.type(input, "1");
    expect(queryByText(/test item 2/i)).not.toBeInTheDocument();
  });

  it("clears input when closed", async () => {
    const { queryByText, getByTestId } = render(combo());
    const trigger = getByTestId("combobox-trigger");
    fireEvent.click(trigger);
    const input = getByTestId("search-input-value");
    userEvent.type(input, "abcdefg");
    fireEvent.click(trigger);
    expect(queryByText(/abcdefg/i)).not.toBeInTheDocument();
  });
});
