import { VStack } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import React from "react";
import { queryParamsDecorator, storybookTitle } from "../../../dev/stories";
import { DrawingToolbar, Props } from "./drawing-tool-bar";

export default {
  title: storybookTitle("Drawing toolbar", DrawingToolbar),
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
  decorators: [queryParamsDecorator],
};

const Template: Story<Props> = (args: Props) => (
  <VStack background="gray.100" padding={4} spacing={4} h="640px" w="72px">
    <DrawingToolbar {...args} />
  </VStack>
);

// @ts-ignore
export const Default = Template.bind({});
Default.args = {};
