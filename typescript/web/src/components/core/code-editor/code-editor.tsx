import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";
import Monaco from "@monaco-editor/react";
import monaco from "monaco-editor";
import { useCallback } from "react";
import { Spinner } from "../spinner";
import {
  MIN_CODE_EDITOR_HEIGHT,
  DEFAULT_CODE_EDITOR_OPTIONS,
} from "./code-editor.constants";
import { useCodeEditor } from "./code-editor.context";

export type MonacoEditorProps = {
  language?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
};

export type CodeEditorProps = BoxProps & MonacoEditorProps;

const MonacoEditor = ({ language, options }: MonacoEditorProps) => {
  const theme = useColorModeValue("light", "vs-dark");
  const { value, setValue, setEditor } = useCodeEditor();
  const handleChange = useCallback(
    (newValue?: string) => setValue(newValue ?? ""),
    [setValue]
  );
  return (
    <Monaco
      language={language}
      theme={theme}
      options={{ ...DEFAULT_CODE_EDITOR_OPTIONS, ...options }}
      onMount={setEditor}
      value={value}
      onChange={handleChange}
      loading={<Spinner />}
    />
  );
};

const useBoxProps = (props: BoxProps): BoxProps => ({
  resize: "vertical",
  overflow: "hidden",
  minHeight: MIN_CODE_EDITOR_HEIGHT,
  height: MIN_CODE_EDITOR_HEIGHT,
  ...props,
});

export const CodeEditor = ({
  language,
  options,
  ...boxProps
}: CodeEditorProps) => (
  <Box {...useBoxProps(boxProps)}>
    <MonacoEditor language={language} options={options} />
  </Box>
);
