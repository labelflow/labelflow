import React from "react";
import { Story } from "@storybook/react";
import { VStack } from "@chakra-ui/react";
import { withNextRouter } from "storybook-addon-next-router";

import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

import { DrawingToolbar, Props } from "../drawing-tool-bar";

export default {
  title: "web-app/Drawing Toolbar",
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
  decorators: [
    chakraDecorator,
    queryParamsDecorator,
    apolloDecorator,
    withNextRouter,
  ],
};

const Template: Story<Props> = (args: Props) => (
  <VStack background="gray.100" padding={4} spacing={4} h="640px" w="72px">
    <DrawingToolbar {...args} />
  </VStack>
);

// @ts-ignore
export const Default = Template.bind({});
Default.args = {};
