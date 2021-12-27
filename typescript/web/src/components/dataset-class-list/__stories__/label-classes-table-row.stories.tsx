import { Story } from "@storybook/react";
import React from "react";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { TestComponent, Wrapper } from "../label-classes-table-row.fixtures";

export default {
  title: "web/Label classes table row",
  decorators: [
    chakraDecorator,
    (StoryComponent: Story) => (
      <Wrapper>
        <StoryComponent />
      </Wrapper>
    ),
  ],
};

export const Default = () => (
  <TestComponent setEditClass={alert} setDeleteClassId={alert} />
);
