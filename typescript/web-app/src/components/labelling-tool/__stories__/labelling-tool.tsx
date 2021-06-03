import React from "react";
import { addDecorator, Story } from "@storybook/react";
import { NextRouter } from "next/router";
import { Box } from "@chakra-ui/react";

import { LabellingTool, Props } from "../labelling-tool";
import { chakraDecorator } from "../../../utils/chakra-decorator";

addDecorator(chakraDecorator);

export default {
  title: "web-app/Labelling Tool",
  component: LabellingTool,
};

const Template: Story<Props> = (args: Props) => (
  <Box background="gray.100" width="640px" height="480px">
    <LabellingTool {...args} />
  </Box>
);

const router = {
  push: (x: string) => console.log(`Navigate to ${x}`),
} as unknown as NextRouter;

export const OneImage = Template.bind({});
OneImage.args = {
  image: {
    name: "Hello puffin",
    id: "toto",
    width: 600,
    height: 750,
    url: "https://images.unsplash.com/photo-1612564148954-59545876eaa0?auto=format&fit=crop&w=600&q=80",
  },
  images: [{ id: "toto" }],
  router,
};

export const ThreeImages = Template.bind({});
ThreeImages.args = {
  image: {
    name: "Hello puffin",
    id: "toto",
    width: 600,
    height: 750,
    url: "https://images.unsplash.com/photo-1612564148954-59545876eaa0?auto=format&fit=crop&w=600&q=80",
  },
  images: [{ id: "titi" }, { id: "toto" }, { id: "tata" }],
  router,
};
