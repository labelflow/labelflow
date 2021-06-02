import React from "react";
import { addDecorator, Story } from "@storybook/react";

import { DrawingToolbar, Props } from "../index";
import { chakraDecorator } from "../../../utils/chakra-decorator";

addDecorator(chakraDecorator);

export default {
  title: "web-app/Drawing Toolbar",
  component: DrawingToolbar,
};

const Template: Story<Props> = (args: Props) => <DrawingToolbar {...args} />;

// @ts-ignore
export const NoInput = Template.bind({});
NoInput.args = {};
