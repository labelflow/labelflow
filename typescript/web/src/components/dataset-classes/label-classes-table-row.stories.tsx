import { ComponentMeta, ComponentStory, Story } from "@storybook/react";
import React from "react";
import { storybookTitle } from "../../utils/stories";
import { chakraDecorator } from "../../utils/stories/chakra-decorator";
import { LabelClassesTableRow as LabelClassesTableRowComponent } from "./label-classes-table-row";
import { TestComponent, Wrapper } from "./label-classes-table-row.fixtures";

const testDecorator = (StoryComponent: Story) => (
  <Wrapper>
    <StoryComponent />
  </Wrapper>
);

export default {
  title: storybookTitle("Dataset classes", LabelClassesTableRowComponent),
  component: LabelClassesTableRowComponent,
  decorators: [chakraDecorator, testDecorator],
} as ComponentMeta<typeof LabelClassesTableRowComponent>;

const Template: ComponentStory<typeof TestComponent> = (args) => (
  <TestComponent {...args} />
);

export const LabelClassesTableRow = Template.bind({});
LabelClassesTableRow.args = {};
