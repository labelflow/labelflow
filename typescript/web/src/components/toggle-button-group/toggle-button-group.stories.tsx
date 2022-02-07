import { Story } from "@storybook/react";
import React from "react";
import { ToggleButtonGroup } from ".";
import { chakraDecorator } from "../../utils/stories/chakra-decorator";
import { TestComponent } from "./toggle-button-group.fixtures";

export default {
  title: "web/Toggle button group/Toggle button group",
  component: ToggleButtonGroup,
  decorators: [chakraDecorator],
};

export const Default: Story = () => <TestComponent defaultValue="optionA" />;
