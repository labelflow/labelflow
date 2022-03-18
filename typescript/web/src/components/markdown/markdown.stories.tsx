import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { PropsWithChildren } from "react";
import { chakraDecorator, storybookTitle } from "../../utils/stories";
import { Markdown } from "./markdown";
import { MARKDOWN_EXAMPLE } from "./markdown.fixtures";

export default {
  title: storybookTitle(Markdown),
  component: Markdown,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof Markdown>;

const Wrapper = ({ children }: PropsWithChildren<{}>) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex direction="column" h="100%">
      <Button onClick={toggleColorMode} mb="5">
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
      {children}
    </Flex>
  );
};

const Template: ComponentStory<typeof Markdown> = (args) => (
  <Wrapper>
    <Markdown {...args} />
  </Wrapper>
);

export const Default = Template.bind({});
Default.args = { value: MARKDOWN_EXAMPLE };

export const WithHeadingLinks = Template.bind({});
WithHeadingLinks.args = { ...Default.args, headingLinks: true };
