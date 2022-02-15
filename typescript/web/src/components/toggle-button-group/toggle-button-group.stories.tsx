import { Story } from "@storybook/react";
import React from "react";
import { ToggleButtonGroup } from ".";
import { storybookTitle } from "../../dev/stories";
import { TestComponent } from "./toggle-button-group.fixtures";

export default {
  title: storybookTitle("Pagination", ToggleButtonGroup),
  component: ToggleButtonGroup,
};

export const Default: Story = () => <TestComponent defaultValue="optionA" />;
