import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";
import { MarkdownInput as MarkdownInputComponent } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";

export default {
  title: storybookTitle(MarkdownInputComponent),
  component: MarkdownInputComponent,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof MarkdownInputComponent>;

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

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const handleUploadFiles = async (files: File[]): Promise<string[]> =>
  await Promise.all(files.map((file) => toBase64(file)));

const Template: ComponentStory<() => JSX.Element> = () => {
  const [value, setValue] = useState("");
  return (
    <Wrapper>
      <MarkdownInputComponent
        value={value}
        onChange={setValue}
        uploadFiles={handleUploadFiles}
      />
    </Wrapper>
  );
};

export const MarkdownInput = Template.bind({});
