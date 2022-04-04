import { ComponentMeta, ComponentStory } from "@storybook/react";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { Icon } from "./icon";

export default {
  title: storybookTitle("Core", "Icons", Icon),
  component: Icon,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => <Icon {...args} />;

export const ReactIcon = Template.bind({});
ReactIcon.args = { name: "search" };

export const SVG = Template.bind({});
SVG.args = { name: "showGeometryViewMode" };
