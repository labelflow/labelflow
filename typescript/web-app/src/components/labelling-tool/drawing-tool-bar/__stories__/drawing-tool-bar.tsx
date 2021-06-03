import React from "react";
import { addDecorator, Story } from "@storybook/react";
import { VStack } from "@chakra-ui/react";

import { chakraDecorator } from "../../../../utils/chakra-decorator";

import { DrawingToolbar, Props } from "../drawing-tool-bar";

addDecorator(chakraDecorator);

export default {
  title: "web-app/Drawing Toolbar",
  component: DrawingToolbar,
};

const Template: Story<Props> = (args: Props) => (
  <VStack background="gray.100" padding={4} spacing={4} h="640px" w="72px">
    <DrawingToolbar {...args} />
  </VStack>
);

// @ts-ignore
export const Default = Template.bind({});
Default.args = {};
