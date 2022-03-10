import { sleep } from "@labelflow/utils";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { chakraDecorator, storybookTitle } from "../../utils/stories";
import { ImageCard } from "./image-card";

export default {
  title: storybookTitle(ImageCard),
  component: ImageCard,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof ImageCard>;

const Template: ComponentStory<typeof ImageCard> = ImageCard;

const IMAGE_ID = "bffcd063-c5dc-414c-bceb-23d349a87739";
const IMAGE_URL = "https://bit.ly/2Z4KKcF";
const IMAGE_NAME = "Image 1";
const IMAGE_HREF =
  "http://localhost:3000/test-workspace/datasets/test-dataset/images/4b626709-b2cf-4247-96a2-21f022a75961";

const COMMON_PROPS = { id: IMAGE_ID, name: IMAGE_NAME, href: IMAGE_HREF };

export const ShortName = Template.bind({});
ShortName.args = { ...COMMON_PROPS, thumbnail: IMAGE_URL };

export const LongName = Template.bind({});
LongName.args = {
  ...COMMON_PROPS,
  name: "Image with a very long name to test the ellipsis",
  thumbnail: IMAGE_URL,
};

export const Hovered = Template.bind({});
Hovered.args = ShortName.args;
Hovered.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  const card = getByTestId("image-card");
  userEvent.hover(card);
  // Wait for the fade to finish before taking a snapshot
  await sleep(500);
};

export const WithoutThumbnail = Template.bind({});
WithoutThumbnail.args = COMMON_PROPS;

export const Loading = Template.bind({});
Loading.args = { ...COMMON_PROPS, thumbnail: "" };
Loading.parameters = { chromatic: { disableSnapshot: true } };

export const Error = Template.bind({});
Error.args = { ...COMMON_PROPS, thumbnail: "unsupported://url" };
