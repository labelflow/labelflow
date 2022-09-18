import { Box } from "@chakra-ui/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { DropZone } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";

export default {
  title: storybookTitle(DropZone),
  component: DropZone,
  decorators: [chakraDecorator],
  argTypes: {
    children: {
      mapping: {
        custom: (
          <Box width="400px" height="150px" bg="#cc5555">
            Custom children
          </Box>
        ),
      },
    },
  },
} as ComponentMeta<typeof DropZone>;

const Template: ComponentStory<typeof DropZone> = (args) => (
  <DropZone {...args} />
);

export const Default = Template.bind({});

export const CustomChildren = Template.bind({});
CustomChildren.args = { children: "custom" };
