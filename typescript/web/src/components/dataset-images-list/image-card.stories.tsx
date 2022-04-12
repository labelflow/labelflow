import { Box } from "@chakra-ui/react";
import { sleep } from "@labelflow/utils";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { BASIC_DATASET_DATA } from "../../utils/fixtures";
import { chakraDecorator, storybookTitle } from "../../utils/stories";
import { ImageCard, ImageCardProps } from "./image-card";
import { MIN_IMAGE_CARD_WIDTH } from "./image-grid";

const [TEST_IMAGE] = BASIC_DATASET_DATA.images;

export default {
  title: storybookTitle("Dataset images", "ImageCard"),
  component: ImageCard,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof ImageCard>;

const Template: ComponentStory<typeof ImageCard> = (args: ImageCardProps) => (
  <Box maxW={MIN_IMAGE_CARD_WIDTH}>
    <ImageCard {...args} />
  </Box>
);

const THUMBNAIL_URL = "https://bit.ly/2Z4KKcF";
const IMAGE_HREF = `http://localhost:3000/${BASIC_DATASET_DATA.workspace.slug}/datasets/${BASIC_DATASET_DATA.slug}/images/${TEST_IMAGE.id}`;

const COMMON_PROPS = {
  id: TEST_IMAGE.id,
  name: TEST_IMAGE.name,
  href: IMAGE_HREF,
};

const IMAGE_CARD_TEST_ID = `image-card-${TEST_IMAGE.name}`;

const hoverCard = async (card: HTMLElement) => {
  userEvent.hover(card);
  // Wait for the fade to finish before taking a snapshot
  await sleep(250);
};

export const ShortName = Template.bind({});
ShortName.args = { ...COMMON_PROPS, thumbnail: THUMBNAIL_URL };

export const LongName = Template.bind({});
LongName.args = {
  ...COMMON_PROPS,
  name: "Image with a very long name to test the ellipsis",
  thumbnail: THUMBNAIL_URL,
};

export const Hovered = Template.bind({});
Hovered.args = ShortName.args;
Hovered.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  const card = getByTestId(IMAGE_CARD_TEST_ID);
  await hoverCard(card);
};

export const WithoutThumbnail = Template.bind({});
WithoutThumbnail.args = COMMON_PROPS;

export const Loading = Template.bind({});
Loading.args = { ...COMMON_PROPS, thumbnail: "" };
Loading.parameters = { chromatic: { disableSnapshot: true } };

export const Error = Template.bind({});
Error.args = { ...COMMON_PROPS, thumbnail: "unsupported://url" };

export const Selected = Template.bind({});
Selected.args = {
  ...COMMON_PROPS,
  thumbnail: THUMBNAIL_URL,
  id: BASIC_DATASET_DATA.images[0].id,
};
Selected.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  const card = getByTestId(IMAGE_CARD_TEST_ID);
  hoverCard(card);
  const checkbox = getByTestId(`select-image-checkbox-${TEST_IMAGE.name}`);
  userEvent.click(checkbox);
};
