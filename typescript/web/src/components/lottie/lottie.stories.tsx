import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Lottie as LottieComponent, LottieProps } from ".";
import { chakraDecorator, storybookTitle } from "../../utils/stories";

export default {
  title: storybookTitle(LottieComponent),
  component: LottieComponent,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof LottieComponent>;

const Template: ComponentStory<(props: LottieProps) => JSX.Element> = (
  args
) => <LottieComponent {...args} />;

export const Lottie = Template.bind({});
Lottie.args = {
  loop: true,
  play: true,
  path: "https://assets3.lottiefiles.com/packages/lf20_d0cvjyyg.json",
};
