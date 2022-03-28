import { HStack, Text } from "@chakra-ui/react";
import { sleep } from "@labelflow/utils";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { Tooltip } from "./tooltip";

export default {
  title: storybookTitle("Core", Tooltip),
  component: Tooltip,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  // Height is fixed to that the tooltip is visible in Chromatic snapshot
  <HStack align="flex-start" h="500px">
    <Tooltip shouldWrapChildren {...args}>
      <Text data-testid="tooltip-child">Hover me</Text>
    </Tooltip>
  </HStack>
);

export const Normal = Template.bind({});
Normal.args = { label: "Normal" };

export const Hovered = Template.bind({});
Hovered.args = { label: "Hovered" };
Hovered.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  const child = getByTestId("tooltip-child");
  userEvent.hover(child);
  // Wait for the tooltip to show before taking a snapshot
  await sleep(500);
};

export const Opened = Template.bind({});
Opened.args = { label: "Opened", isOpen: true };
