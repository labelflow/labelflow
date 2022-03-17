import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import { TutorialPrompt } from ".";
import { chakraDecorator, storybookTitle } from "../../utils/stories";

const Decorator = (StoryComponent: Story) => (
  <Flex
    grow={1}
    direction="column"
    as="main"
    bg={useColorModeValue("gray.100", "gray.900")}
    align="center"
  >
    <StoryComponent />
  </Flex>
);

export default {
  title: storybookTitle(TutorialPrompt),
  decorators: [chakraDecorator, Decorator],
};

export const Default = () => {
  return (
    <Box background="gray.100" padding={4} w="xl">
      <TutorialPrompt />
    </Box>
  );
};
