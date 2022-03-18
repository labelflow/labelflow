import { isNil } from "lodash/fp";
import { LintError } from "markdownlint";
import * as monaco from "monaco-editor";
import { basename, extname } from "path";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useDebounce } from "use-debounce";
import { CodeEditorProvider, useCodeEditor } from "../code-editor";
import { useLintMarkdown } from "./lint-markdown";
import {
  MarkdownEditorAction,
  useCodeEditorActions as useMarkdownEditorActions,
  wrapEditorAction,
} from "./markdown-input-actions";
import {
  MARKDOWN_INPUT_DEBOUNCE_DELAY,
  MARKDOWN_INPUT_DEBOUNCE_MAX_WAIT,
} from "./markdown.constants";

export type MarkdownInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  /**
   * Callback function which will be called when new files has to be uploaded
   * for addition in the document
   * @remarks Output must respect the same order as the input
   */
  uploadFiles?: (files: File[]) => Promise<string[]>;
};

export type MarkdownInputAction = Omit<MarkdownEditorAction, "run"> & {
  run: () => void;
};

export type MarkdownInputState = {
  actions: MarkdownInputAction[];
  debouncedValue: string;
  isDebouncing: boolean;
  errors: LintError[];
  uploadFiles(files: FileList): Promise<void>;
};

export const MarkdownInputContext = createContext({} as MarkdownInputState);

export const useMarkdownInput = () => useContext(MarkdownInputContext);

const useDebouncedValue = (): Pick<
  MarkdownInputState,
  "debouncedValue" | "isDebouncing"
> => {
  const { value } = useCodeEditor();
  const [debouncedValue] = useDebounce(value, MARKDOWN_INPUT_DEBOUNCE_DELAY, {
    trailing: true,
    maxWait: MARKDOWN_INPUT_DEBOUNCE_MAX_WAIT,
  });
  return { debouncedValue, isDebouncing: value !== debouncedValue };
};

const useMarkdownInputActions = (
  actions: MarkdownEditorAction[]
): MarkdownInputAction[] => {
  const { editor } = useCodeEditor();
  return actions.map<MarkdownInputAction>((action) => ({
    ...action,
    run: () => {
      if (isNil(editor.current)) return;
      action.run(editor.current);
    },
  }));
};

const getLinterMarker = (
  model: monaco.editor.ITextModel,
  { ruleNames, ruleDescription, lineNumber, errorRange }: LintError
): monaco.editor.IMarkerData => {
  const [ruleId, ruleName] = ruleNames;
  const startColumn = errorRange?.[0] ?? 1;
  const length = errorRange?.[1] ?? model.getLineLength(lineNumber);
  return {
    message: `${ruleId}/${ruleName}: ${ruleDescription}`,
    severity: monaco.MarkerSeverity.Warning,
    startLineNumber: lineNumber,
    startColumn,
    endLineNumber: lineNumber,
    endColumn: startColumn + length - 1,
  };
};

const useLinter = (value: string, skip: boolean): LintError[] => {
  const { editor } = useCodeEditor();
  const onChange = useCallback(
    (lintErrors: LintError[]) => {
      const model = editor.current?.getModel();
      if (isNil(model)) return;
      const markers = lintErrors.map((error) => getLinterMarker(model, error));
      monaco.editor.setModelMarkers(model, "markdown", markers);
    },
    [editor]
  );
  return useLintMarkdown(value, { skip, onChange });
};

const useUploadFiles = (
  uploadFiles: MarkdownInputProps["uploadFiles"]
): MarkdownInputState["uploadFiles"] => {
  const { editor } = useCodeEditor();
  return useCallback(
    async (fileList: FileList) => {
      if (isNil(uploadFiles)) return;
      const files = Array.from(fileList);
      if (isNil(editor.current) || files.length === 0) return;
      const urls = await uploadFiles(files);
      const links = urls
        .map((url, index) => {
          const fileName = files[index].name ?? "";
          return `![${basename(fileName, extname(fileName))}](${url})`;
        })
        .join("\n");
      wrapEditorAction(({ text }) => `${text}${links}`)(editor.current);
    },
    [editor, uploadFiles]
  );
};

export type MarkdownInputProviderProps = PropsWithChildren<MarkdownInputProps>;

const useProvider = (
  editorActions: MarkdownEditorAction[],
  uploadFiles: MarkdownInputProviderProps["uploadFiles"]
): MarkdownInputState => {
  const { debouncedValue, isDebouncing } = useDebouncedValue();
  const actions = useMarkdownInputActions(editorActions);
  const errors = useLinter(debouncedValue, isDebouncing);
  const handleUploadFiles = useUploadFiles(uploadFiles);
  return {
    debouncedValue,
    isDebouncing,
    actions,
    errors,
    uploadFiles: handleUploadFiles,
  };
};

type MarkdownInputProviderComponentProps = Pick<
  MarkdownInputProviderProps,
  "children" | "uploadFiles"
> & { actions: MarkdownEditorAction[] };

export const MarkdownInputProviderComponent = ({
  children,
  actions,
  uploadFiles,
}: MarkdownInputProviderComponentProps) => (
  <MarkdownInputContext.Provider value={useProvider(actions, uploadFiles)}>
    {children}
  </MarkdownInputContext.Provider>
);

const queryClient = new QueryClient();

export const MarkdownInputProvider = ({
  children,
  value,
  onChange,
  uploadFiles,
}: MarkdownInputProviderProps) => {
  const actions = useMarkdownEditorActions();
  return (
    <QueryClientProvider client={queryClient}>
      <CodeEditorProvider value={value} onChange={onChange} actions={actions}>
        <MarkdownInputProviderComponent
          actions={actions}
          uploadFiles={uploadFiles}
        >
          {children}
        </MarkdownInputProviderComponent>
      </CodeEditorProvider>
    </QueryClientProvider>
  );
};
