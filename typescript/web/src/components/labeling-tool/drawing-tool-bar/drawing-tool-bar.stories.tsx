import { VStack } from "@chakra-ui/react";
import { ComponentStory } from "@storybook/react";
import React from "react";
import {
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/stories";
import { DrawingToolbar as DrawingToolbarComponent } from "./drawing-tool-bar";

export default {
  title: storybookTitle(
    "Labeling tool",
    "Drawing toolbar",
    DrawingToolbarComponent
  ),
  component: DrawingToolbarComponent,
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

const Template: ComponentStory<typeof DrawingToolbarComponent> = () => (
  <VStack background="gray.100" padding={4} spacing={4} h="640px" w="72px">
    <DrawingToolbarComponent />
  </VStack>
);

export const DrawingToolbar = Template.bind({});
DrawingToolbar.args = {};
