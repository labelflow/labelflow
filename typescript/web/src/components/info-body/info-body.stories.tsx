import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import { chakraDecorator, storybookTitle } from "../../utils/stories";
import { EmptyStateNoSearchResult } from "../empty-state";
import { InfoBody } from "./info-body";

const Decorator = (StoryComponent: Story) => (
  <Flex
    grow={1}
    direction="column"
    as="main"
    bg={useColorModeValue("gray.100", "gray.900")}
  >
    <StoryComponent />
  </Flex>
);

export default {
  title: storybookTitle("Info Body"),
  decorators: [chakraDecorator, Decorator],
};

export const Default = () => (
  <InfoBody
    title="Page not found"
    illustration={EmptyStateNoSearchResult}
    homeButtonType="nextLink"
  >
    <Text mt="4" fontSize="lg" maxW="2xl">
      There is nothing to see here.
      <br />
      If you followed a link to get here, you might not have access to the
      content at this page, or the link might be broken.
    </Text>
  </InfoBody>
);
