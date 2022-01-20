import { Story } from "@storybook/react";
import React from "react";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";
import { TestComponent, Wrapper } from "../label-classes-table-row.fixtures";

const testDecorator = (StoryComponent: Story) => (
  <Wrapper>
    <StoryComponent />
  </Wrapper>
);

export default {
  title: "web/Dataset classes/Label classes table row",
  decorators: [chakraDecorator, testDecorator],
};

export const Default = () => (
  <TestComponent setEditClass={alert} setDeleteClassId={alert} />
);
