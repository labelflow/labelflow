import { Story } from "@storybook/react";
import { TextLink as TextLinkComponent } from "./text-link";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";

export default {
  title: storybookTitle("Core", TextLinkComponent),
  component: TextLinkComponent,
  decorators: [chakraDecorator],
};

export const TextLink: Story = () => (
  <TextLinkComponent href="/">Back home</TextLinkComponent>
);
