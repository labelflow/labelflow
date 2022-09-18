import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { ComponentStory, ComponentMeta, Story } from "@storybook/react";
import { PropsWithChildren } from "react";
import { Code } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { CODE_BLOCK_EXAMPLE, SINGLE_LINE_CODE_EXAMPLE } from "./code.fixtures";

export default {
  title: storybookTitle(Code),
  component: Code,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof Code>;

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

const Template: ComponentStory<typeof Code> = (args) => (
  <Wrapper>
    <Code {...args} />
  </Wrapper>
);

export const Block = Template.bind({});
Block.args = CODE_BLOCK_EXAMPLE;

export const SingleLineBlock = Template.bind({});
SingleLineBlock.args = SINGLE_LINE_CODE_EXAMPLE;

export const Inline: Story = () => (
  <Wrapper>
    <p>
      {"To call hello, use "}
      <Code inline {...SINGLE_LINE_CODE_EXAMPLE} />
      {" and a message should print..."}
    </p>
  </Wrapper>
);
