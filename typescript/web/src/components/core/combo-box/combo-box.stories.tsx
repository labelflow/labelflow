import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ComboBox, ComboBoxProps } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import {
  TestItem,
  TestItemDefinition,
  TestListItem,
  TEST_ITEMS,
  TEST_MANY_ITEMS,
} from "./combo-box.fixtures";

export default {
  title: storybookTitle("Core", ComboBox),
  component: ComboBox,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof ComboBox>;

type TemplateProps = ComboBoxProps<TestItemDefinition, "label">;

const Template: ComponentStory<(props: TemplateProps) => JSX.Element> = ({
  items = TEST_ITEMS,
  ...props
}) => (
  <ComboBox
    {...props}
    items={items}
    compareProp="label"
    item={TestItem}
    listItem={TestListItem}
  />
);

export const Default = Template.bind({});
Default.args = {};

export const WithSelectedItem = Template.bind({});
WithSelectedItem.args = { selectedItem: TEST_ITEMS[0] };

export const Opened = Template.bind({});
Opened.args = {
  initialHighlightedIndex: 1,
  initialInputValue: "",
  isOpen: true,
};

export const WithManyItems = Template.bind({});
WithManyItems.args = { items: TEST_MANY_ITEMS };

export const OpenedWithManyItems = Template.bind({});
OpenedWithManyItems.args = { ...Opened.args, ...WithManyItems.args };
