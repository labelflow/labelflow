import { useControllableState } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import * as monaco from "monaco-editor";
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useEffect,
  useRef,
} from "react";
import { SetRequired } from "type-fest";

export type EditorRef = RefObject<monaco.editor.IStandaloneCodeEditor>;

export type CodeEditorProviderProps = PropsWithChildren<{
  value?: string;
  onChange?: (value: string) => void;
  actions?: monaco.editor.IActionDescriptor[];
}>;

export type CodeEditorState = SetRequired<
  Omit<CodeEditorProviderProps, "actions">,
  "value"
> & {
  editor: EditorRef;
  setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  setValue: NonNullable<CodeEditorProviderProps["onChange"]>;
};

export const CodeEditorContext = createContext({} as CodeEditorState);

export const useCodeEditor = () => useContext(CodeEditorContext);

const ensureActions = (
  editor: monaco.editor.IStandaloneCodeEditor,
  actions: monaco.editor.IActionDescriptor[]
) =>
  actions.forEach((action) => {
    if (!isNil(editor.getAction(action.id))) return;
    editor.addAction(action);
  });

const useEditorRef = (): Pick<CodeEditorState, "editor" | "setEditor"> => {
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const setEditor = (newEditor: monaco.editor.IStandaloneCodeEditor | null) => {
    editor.current = newEditor;
  };
  return { editor, setEditor };
};

const useActions = (
  editor: EditorRef,
  descriptors: monaco.editor.IActionDescriptor[]
) => {
  useEffect(() => {
    if (isNil(editor.current)) return;
    ensureActions(editor.current, descriptors);
  }, [descriptors, editor]);
};

const useProvider = ({
  actions: actionsDescriptors = [],
  value: valueProp,
  onChange,
  ...props
}: CodeEditorProviderProps): CodeEditorState => {
  const [value, setValue] = useControllableState({
    defaultValue: "",
    value: valueProp,
    onChange,
  });
  const editorRefState = useEditorRef();
  useActions(editorRefState.editor, actionsDescriptors);
  return { value, setValue, ...props, ...editorRefState };
};

export const CodeEditorProvider = ({
  children,
  ...props
}: CodeEditorProviderProps) => (
  <CodeEditorContext.Provider value={useProvider(props)}>
    {children}
  </CodeEditorContext.Provider>
);
