import { Box, Button, Flex, useColorMode } from "@chakra-ui/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { PropsWithChildren } from "react";
import { CodeEditor, CodeEditorProvider } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";

export default {
  title: storybookTitle(CodeEditor),
  component: CodeEditor,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof CodeEditor>;

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

const Template: ComponentStory<typeof CodeEditor> = (args) => (
  <Wrapper>
    <CodeEditorProvider>
      <CodeEditor {...args} />
    </CodeEditorProvider>
  </Wrapper>
);

export const Default = Template.bind({});

export const Responsive = () => {
  return (
    <Wrapper>
      <Box
        height="300px"
        width="300px"
        resize="both"
        overflow="hidden"
        padding="2em"
        background="blue.500"
      >
        <CodeEditorProvider>
          <CodeEditor w="100%" h="100%" resize="none" />
        </CodeEditorProvider>
      </Box>
    </Wrapper>
  );
};
