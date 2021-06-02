import React from "react";
import { addDecorator, Story } from "@storybook/react";
import { NextRouter } from "next/router";
import { HStack, Button, Flex } from "@chakra-ui/react";

import { ImageNavigationTool, Props } from "../image-navigation-tool";
import { chakraDecorator } from "../../../../utils/chakra-decorator";

addDecorator(chakraDecorator);

export default {
  title: "web-app/Image Navigation Toolbar",
  component: ImageNavigationTool,
};

const Template: Story<Props> = (args: Props) => (
  <HStack background="gray.100" padding={4} spacing={4}>
    <ImageNavigationTool {...args} />
    <Button variant="solid" background="white" color="gray.800">
      Button just to compare
    </Button>
    <Flex> </Flex>
  </HStack>
);

const router = {
  push: (x: string) => console.log(`Navigate to ${x}`),
} as unknown as NextRouter;

// @ts-ignore
export const NoInput = Template.bind({});
NoInput.args = {};

export const NoImage = Template.bind({});
NoImage.args = {
  imageId: "a",
  images: [],
  router,
};

export const NoImageNoId = Template.bind({});
NoImageNoId.args = {
  images: [],
  router,
};

export const OneImage = Template.bind({});
OneImage.args = {
  imageId: "a",
  images: [{ id: "a" }],
  router,
};

export const OneWrongImage = Template.bind({});
OneWrongImage.args = {
  imageId: "a",
  images: [{ id: "b" }],
  router,
};

export const Basic1 = Template.bind({});
Basic1.args = {
  imageId: "a",
  images: [{ id: "a" }, { id: "b" }, { id: "c" }],
  router,
};

export const Basic2 = Template.bind({});
Basic2.args = {
  imageId: "b",
  images: [{ id: "a" }, { id: "b" }, { id: "c" }],
  router,
};

export const Basic3 = Template.bind({});
Basic3.args = {
  imageId: "c",
  images: [{ id: "a" }, { id: "b" }, { id: "c" }],
  router,
};

export const BasicWrongImage = Template.bind({});
BasicWrongImage.args = {
  imageId: "d",
  images: [{ id: "a" }, { id: "b" }, { id: "c" }],
  router,
};
