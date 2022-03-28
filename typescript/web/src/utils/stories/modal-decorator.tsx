import { Box } from "@chakra-ui/react";
import { Story } from "@storybook/react";

// Reuse Cypress values to make sure that it's compliant with our minimal UX requirements
const CYPRESS_SCREEN_WIDTH = 1000;
const CYPRESS_SCREEN_HEIGHT = 660;

export const modalDecorator = (StoryComponent: Story) => (
  <Box w={CYPRESS_SCREEN_WIDTH} h={CYPRESS_SCREEN_HEIGHT}>
    <StoryComponent />
  </Box>
);
