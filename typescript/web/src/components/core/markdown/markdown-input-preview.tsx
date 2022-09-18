import { BoxProps } from "@chakra-ui/react";
import { Markdown } from "./markdown";
import { useMarkdownInput } from "./markdown-input.context";

export const MarkdownInputPreview = (props: BoxProps) => {
  const { debouncedValue } = useMarkdownInput();
  return <Markdown value={debouncedValue} {...props} />;
};
