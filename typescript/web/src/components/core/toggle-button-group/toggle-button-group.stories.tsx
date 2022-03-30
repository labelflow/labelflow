import { Story } from "@storybook/react";
import React from "react";
import { ToggleButtonGroup } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { TestComponent } from "./toggle-button-group.fixtures";

export default {
  title: storybookTitle("Core", "Pagination", ToggleButtonGroup),
  component: ToggleButtonGroup,
  decorators: [chakraDecorator],
};

export const Default: Story = () => <TestComponent defaultValue="optionA" />;
