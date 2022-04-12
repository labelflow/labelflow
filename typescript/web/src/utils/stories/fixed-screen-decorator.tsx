import { Flex } from "@chakra-ui/react";
import { Story } from "@storybook/react";

// Reuse Cypress values to make sure that it's compliant with our minimal UX requirements
const CYPRESS_SCREEN_WIDTH = 1000;
const CYPRESS_SCREEN_HEIGHT = 660;

export const fixedScreenDecorator = (StoryComponent: Story) => (
  <Flex
    direction="column"
    minW={CYPRESS_SCREEN_WIDTH}
    minH={CYPRESS_SCREEN_HEIGHT}
    maxW={CYPRESS_SCREEN_WIDTH}
    maxH={CYPRESS_SCREEN_HEIGHT}
  >
    <StoryComponent />
  </Flex>
);
