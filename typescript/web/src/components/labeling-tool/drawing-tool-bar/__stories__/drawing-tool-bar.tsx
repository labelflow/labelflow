import React from "react";
import { Story } from "@storybook/react";
import { VStack } from "@chakra-ui/react";

import {
  chakraDecorator,
  queryParamsDecorator,
} from "../../../../utils/storybook";

import { DrawingToolbar, Props } from "../drawing-tool-bar";

export default {
  title: "web/Drawing Toolbar",
  component: DrawingToolbar,
  parameters: {
    nextRouter: {
      path: "/images/[id]",
      asPath: "/images/mock-image-id",
      query: {
        id: "mock-image-id",
      },
    },
  },
  decorators: [chakraDecorator, queryParamsDecorator],
};

const Template: Story<Props> = (args: Props) => (
  <VStack background="gray.100" padding={4} spacing={4} h="640px" w="72px">
    <DrawingToolbar {...args} />
  </VStack>
);

// @ts-ignore
export const Default = Template.bind({});
Default.args = {};
