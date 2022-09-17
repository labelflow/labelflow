import { BoxProps } from "@chakra-ui/react";
import { DragEvent, useCallback } from "react";
import { CodeEditor } from "../code-editor";
import { DEFAULT_EDITOR_OPTIONS } from "./markdown.constants";
import { useMarkdownInput } from "./markdown-input.context";

export const MarkdownInputEditor = (props: BoxProps) => {
  const { uploadFiles } = useMarkdownInput();
  const handleDrop = useCallback(
    ({ dataTransfer: { files } }: DragEvent<HTMLDivElement>) =>
      uploadFiles(files),
    [uploadFiles]
  );
  return (
    <CodeEditor
      language="markdown"
      options={DEFAULT_EDITOR_OPTIONS}
      onDrop={handleDrop}
      {...props}
    />
  );
};
