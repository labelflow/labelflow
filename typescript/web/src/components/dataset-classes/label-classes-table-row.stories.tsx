import { Story } from "@storybook/react";
import React from "react";
import { storybookTitle } from "../../utils/stories";
import { chakraDecorator } from "../../utils/stories/chakra-decorator";
import { LabelClassesTableRow } from "./label-classes-table-row";
import { TestComponent, Wrapper } from "./label-classes-table-row.fixtures";

const testDecorator = (StoryComponent: Story) => (
  <Wrapper>
    <StoryComponent />
  </Wrapper>
);

export default {
  title: storybookTitle("Dataset classes", LabelClassesTableRow),
  decorators: [chakraDecorator, testDecorator],
};

export const Default = () => (
  <TestComponent setEditClass={alert} setDeleteClassId={alert} />
);
