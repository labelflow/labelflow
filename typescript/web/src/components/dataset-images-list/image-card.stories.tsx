import { sleep } from "@labelflow/utils";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { chakraDecorator, storybookTitle } from "../../utils/stories";
import { ImageCard, ImageCardProps } from "./image-card";

export default {
  title: storybookTitle(ImageCard),
  component: ImageCard,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof ImageCard>;

const Template: ComponentStory<typeof ImageCard> = ImageCard;

const COMMON_PROPS: Omit<ImageCardProps, "onAskImageDelete"> = {
  id: "bffcd063-c5dc-414c-bceb-23d349a87739",
  href: "https://bit.ly/2Z4KKcF",
  thumbnail: "https://bit.ly/2Z4KKcF",
  name: "Image 1",
};

export const ShortName = Template.bind({});
ShortName.args = COMMON_PROPS;

export const LongName = Template.bind({});
LongName.args = {
  ...COMMON_PROPS,
  name: "Image with a very long name to test the ellipsis",
};

export const Hovered = Template.bind({});
Hovered.args = COMMON_PROPS;
Hovered.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  const card = getByTestId("image-card");
  userEvent.hover(card);
  // Wait for the fade to finish before taking a snapshot
  await sleep(500);
};

export const WithoutThumbnail = Template.bind({});
WithoutThumbnail.args = {
  ...(() => {
    const { thumbnail, ...props } = COMMON_PROPS;
    return props;
  })(),
  name: "Image with a very long name to test the ellipsis",
};

export const Loading = Template.bind({});
Loading.args = {
  ...(() => {
    const { thumbnail, ...props } = COMMON_PROPS;
    return props;
  })(),
  href: "",
  name: "Image with a very long name to test the ellipsis",
};
