import { ComponentMeta, ComponentStory } from "@storybook/react";
import { omit } from "lodash/fp";
import { chakraDecorator, storybookTitle } from "../../utils/stories";
import { ClassListItem } from "./class-list-item";

export default {
  title: storybookTitle(ClassListItem),
  decorators: [chakraDecorator],
  parameters: {
    viewport: { defaultViewport: "chakra-sizes-xs" },
  },
} as ComponentMeta<typeof ClassListItem>;

const classDefault = { color: "#F59E0B", name: "aClass", shortcut: "1" };
const classCreate = { type: "CreateClassItem", name: "nonExistingClass" };

const Template: ComponentStory<typeof ClassListItem> = ClassListItem;

export const Default = Template.bind({});
Default.args = {
  highlight: false,
  index: 0,
  item: classDefault,
  itemProps: {},
};

export const Highlighted = Template.bind({});
Highlighted.args = {
  highlight: true,
  index: 0,
  item: classDefault,
  itemProps: {},
};

export const Selected = Template.bind({});
Selected.args = {
  selected: true,
  index: 0,
  item: classDefault,
  itemProps: {},
};

export const NoShortcut = Template.bind({});
NoShortcut.args = {
  index: 0,
  item: omit("shortcut", classDefault),
  itemProps: {},
};

export const NewClass = Template.bind({});
NewClass.args = {
  index: 0,
  item: classCreate,
  itemProps: {},
  isCreateClassItem: true,
};

export const NewClassHighlighted = Template.bind({});
NewClassHighlighted.args = {
  highlight: true,
  index: 0,
  item: classCreate,
  itemProps: {},
  isCreateClassItem: true,
};
