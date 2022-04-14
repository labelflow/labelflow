import { Story } from "@storybook/react";
import React from "react";
import { ToggleButtonGroup as ToggleButtonGroupComponent } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { TestComponent } from "./toggle-button-group.fixtures";

export default {
  title: storybookTitle("Core", ToggleButtonGroupComponent),
  component: ToggleButtonGroupComponent,
  decorators: [chakraDecorator],
};

export const ToggleButtonGroup: Story = () => (
  <TestComponent defaultValue="optionA" />
);
