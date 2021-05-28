import React from "react";
import { addDecorator, Story } from "@storybook/react";
import { NextRouter } from "next/router";
import { HStack, Button, Flex } from "@chakra-ui/react";

import { ImageNav, Props } from "../index";
import { chakraDecorator } from "../../../utils/chakra-decorator";

addDecorator(chakraDecorator);

export default {
  title: "web-app/Image Navigation Toolbar",
  component: ImageNav,
};

const Template: Story<Props> = (args: Props) => (
  <HStack background="gray.100" padding={4} spacing={4}>
    <ImageNav {...args} />
    <Button variant="solid" background="white" color="gray.800">
      Button just to compare
    </Button>
    <Flex> </Flex>
  </HStack>
);

// @ts-ignore
export const NoInput = Template.bind({});
NoInput.args = {};

export const NoImage = Template.bind({});
NoImage.args = {
  imageId: "a",
  images: [],
  router: {} as unknown as NextRouter,
};

export const NoImageNoId = Template.bind({});
NoImageNoId.args = { images: [], router: {} as unknown as NextRouter };

export const OneImage = Template.bind({});
OneImage.args = {
  imageId: "a",
  images: [{ id: "a" }],
  router: {} as unknown as NextRouter,
};

export const OneWrongImage = Template.bind({});
OneWrongImage.args = {
  imageId: "a",
  images: [{ id: "b" }],
  router: {} as unknown as NextRouter,
};

export const Basic1 = Template.bind({});
Basic1.args = {
  imageId: "a",
  images: [{ id: "a" }, { id: "b" }, { id: "c" }],
  router: {} as unknown as NextRouter,
};

export const Basic2 = Template.bind({});
Basic2.args = {
  imageId: "b",
  images: [{ id: "a" }, { id: "b" }, { id: "c" }],
  router: {} as unknown as NextRouter,
};

export const Basic3 = Template.bind({});
Basic3.args = {
  imageId: "c",
  images: [{ id: "a" }, { id: "b" }, { id: "c" }],
  router: {} as unknown as NextRouter,
};

export const BasicWrongImage = Template.bind({});
BasicWrongImage.args = {
  imageId: "d",
  images: [{ id: "a" }, { id: "b" }, { id: "c" }],
  router: {} as unknown as NextRouter,
};
