import { Story } from "@storybook/react";
import React from "react";
import { ToggleButtonGroup } from ".";
import { storybookTitle } from "../../utils/stories";
import { chakraDecorator } from "../../utils/stories/chakra-decorator";
import { TestComponent } from "./toggle-button-group.fixtures";

export default {
  title: storybookTitle("Pagination", ToggleButtonGroup),
  component: ToggleButtonGroup,
  decorators: [chakraDecorator],
};

export const Default: Story = () => <TestComponent defaultValue="optionA" />;
