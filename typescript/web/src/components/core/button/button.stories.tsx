import { ComponentMeta, ComponentStory } from "@storybook/react";
import { APP_GITHUB_URL } from "../../../constants";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { Button } from "./button";

export default {
  title: storybookTitle("Core", "Button"),
  component: Button,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = { children: "Click me" };

export const WithHref = Template.bind({});
WithHref.args = {
  children: "I'm actually a link",
  href: APP_GITHUB_URL,
  target: "_blank",
};

export const WithLeftIcon = Template.bind({});
WithLeftIcon.args = { children: "I have a left icon", leftIcon: "search" };

export const WithRightIcon = Template.bind({});
WithRightIcon.args = { children: "I have a right icon", rightIcon: "search" };
