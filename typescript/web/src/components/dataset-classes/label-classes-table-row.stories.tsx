import { Story } from "@storybook/react";
import React from "react";
import { storybookTitle } from "../../dev/stories";
import { LabelClassesTableRow } from "./label-classes-table-row";
import { TestComponent, Wrapper } from "./label-classes-table-row.fixtures";

const testDecorator = (StoryComponent: Story) => (
  <Wrapper>
    <StoryComponent />
  </Wrapper>
);

export default {
  title: storybookTitle("Dataset classes", LabelClassesTableRow),
  decorators: [testDecorator],
};

export const Default = () => (
  <TestComponent setEditClass={alert} setDeleteClassId={alert} />
);
