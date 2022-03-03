import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Icon as IconComponent } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";

export default {
  title: storybookTitle("Core", "Icons", IconComponent),
  component: IconComponent,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof IconComponent>;

const Template: ComponentStory<typeof IconComponent> = (args) => (
  <IconComponent {...args} />
);

export const Icon = Template.bind({});
Icon.args = { name: "search" };
