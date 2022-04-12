import { Flex, Text } from "@chakra-ui/react";
import { expect } from "@storybook/jest";
import { ComponentMeta, ComponentStory, StoryFn } from "@storybook/react";
import { waitFor, within } from "@storybook/testing-library";
import { isNil, range } from "lodash/fp";
import { VirtualGrid, VirtualGridItemProps, VirtualGridProps } from ".";
import {
  chakraDecorator,
  CHROMATIC_VIEWPORTS,
  fixedScreenDecorator,
  storybookTitle,
} from "../../../utils/stories";

export default {
  title: storybookTitle("Core", VirtualGrid),
  component: VirtualGrid,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof VirtualGrid>;

const Template: ComponentStory<
  (args: VirtualGridProps<string>) => JSX.Element
> = (args) => <VirtualGrid {...args} />;

const Item = ({ item, index }: VirtualGridItemProps<string>) => (
  <Flex
    data-testid={item}
    direction="column"
    grow={1}
    justify="center"
    color="white"
    textAlign="center"
    bg={`hsl(${index}, 100%, 50%)`}
  >
    <Text>{index}</Text>
  </Flex>
);

const TEST_ITEMS = range(0, 360).map((index) => `virtual-grid-item-${index}`);

const TEST_MIN_ITEM_WIDTH = 100;
const TEST_ITEM_HEIGHT = 60;

type PlayOptions = {
  minIndex?: number;
  maxIndex?: number;
  scrollY?: number;
};

const createPlay =
  ({
    minIndex = 0,
    maxIndex = TEST_ITEMS.length - 1,
    scrollY,
  }: PlayOptions): StoryFn<VirtualGridProps<string>>["play"] =>
  async ({ canvasElement }) => {
    const { getByTestId, queryByTestId } = within(canvasElement);
    await waitFor(() =>
      expect(getByTestId("virtual-grid-scrollable-box")).toBeVisible()
    );
    const scrollableBox = getByTestId("virtual-grid-scrollable-box");
    if (!isNil(scrollY)) {
      await waitFor(() => expect(scrollableBox.scrollHeight).not.toBe(0));
      const scrollTop = Math.min(scrollY, scrollableBox.scrollHeight);
      scrollableBox.scrollTop = scrollTop;
    }
    await waitFor(() =>
      TEST_ITEMS.slice(minIndex + 1, maxIndex - 1).forEach((item) =>
        expect(getByTestId(item)).toBeVisible()
      )
    );
    const shouldNotBeVisible = [
      ...TEST_ITEMS.slice(0, minIndex),
      ...TEST_ITEMS.slice(maxIndex + 1),
    ].some((item) => !isNil(queryByTestId(item)));
    expect(shouldNotBeVisible).toBe(false);
  };

const TEST_ARGS: VirtualGridProps<string> = {
  items: TEST_ITEMS,
  minItemWidth: TEST_MIN_ITEM_WIDTH,
  itemHeight: TEST_ITEM_HEIGHT,
  renderItem: Item,
  bg: "gray.500",
};

export const ScrollTop = Template.bind({});
ScrollTop.decorators = [fixedScreenDecorator];
ScrollTop.args = TEST_ARGS;
ScrollTop.play = createPlay({
  maxIndex: 62,
});

export const ScrollMiddle = Template.bind({});
ScrollMiddle.decorators = [fixedScreenDecorator];
ScrollMiddle.args = TEST_ARGS;
ScrollMiddle.play = createPlay({
  scrollY: 1700,
  minIndex: 126,
  maxIndex: 202,
});

export const ScrollBottom = Template.bind({});
ScrollBottom.decorators = [fixedScreenDecorator];
ScrollBottom.args = TEST_ARGS;
ScrollBottom.play = createPlay({
  scrollY: Number.POSITIVE_INFINITY,
  minIndex: 301,
});

export const Responsive = Template.bind({});
Responsive.args = TEST_ARGS;
Responsive.parameters = {
  viewport: { defaultViewport: "responsive" },
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
