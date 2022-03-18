/* eslint-disable no-bitwise */
import { paramCase } from "change-case";
import { isNil } from "lodash/fp";
import * as monaco from "monaco-editor";
import { IconType } from "react-icons/lib";
import {
  RiBold,
  RiCodeBoxLine,
  RiCodeLine,
  RiDoubleQuotesL,
  RiHeading,
  RiItalic,
  RiLink,
  RiListOrdered,
  RiListUnordered,
  RiStrikethrough,
} from "react-icons/ri";
import { APP_NAME } from "../../constants";

export type MarkdownEditorAction = monaco.editor.IActionDescriptor & {
  icon: IconType;
};

type ICodeEditor = monaco.editor.ICodeEditor;
type IEditOperation = monaco.editor.IIdentifiedSingleEditOperation;

type EditorActionContext = {
  editor: ICodeEditor;
  text: string;
  selection: monaco.Selection;
};

type EditorActionResult =
  | string
  | [IEditOperation[], monaco.Selection[] | undefined];

type EditorActionCallback = (
  context: EditorActionContext
) => EditorActionResult;

export const wrapEditorAction =
  (run: EditorActionCallback): MarkdownEditorAction["run"] =>
  (editor) => {
    const selection = editor.getSelection();
    if (isNil(selection)) return;
    const text = editor.getModel()?.getValueInRange(selection);
    if (isNil(text)) return;
    const result = run({ editor, text, selection });
    const [edits, newSelection] =
      typeof result === "string"
        ? [[{ range: selection, text: result }]]
        : result;
    editor.executeEdits(editor.getValue(), edits, newSelection);
    editor.focus();
  };

const getId = (label: string): string =>
  `${paramCase(APP_NAME)}.markdown.${paramCase(label)}`;

const useEditorAction = (
  label: string,
  icon: IconType,
  keybinding: number,
  onRun: EditorActionCallback
): MarkdownEditorAction => ({
  id: getId(label),
  label,
  icon,
  keybindings: [keybinding],
  run: wrapEditorAction(onRun),
});

const strip = (text: string, pre: string, post: string): string =>
  text.substring(pre.length, text.length - post.length);

const useSurroundAction = (
  pre: string,
  post: string,
  shouldStrip?: (text: string) => boolean
): EditorActionCallback => {
  return ({ text, selection }) => {
    const { startLineNumber, endLineNumber } = selection;
    const stripText = shouldStrip?.(text);
    const emptyText = text.length === 0;
    const startColumn = selection.startColumn + (emptyText ? pre.length : 0);
    const changeFactor = stripText ? -1 : 1;
    const endColumn = emptyText
      ? startColumn
      : selection.endColumn +
        (startLineNumber === endLineNumber ? pre.length * changeFactor : 0) +
        post.length * changeFactor;
    const edit = {
      range: selection,
      text: stripText ? strip(text, pre, post) : `${pre}${text}${post}`,
    };
    const newSelection = new monaco.Selection(
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn
    );
    return [[edit], [newSelection]];
  };
};

const useHeader = (): MarkdownEditorAction =>
  useEditorAction(
    "Header",
    RiHeading,
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH,
    ({ editor, selection: { startLineNumber } }) => {
      const firstLine = editor?.getModel()?.getLineContent(startLineNumber);
      const hasHeader = /^#+\s.*$/.test(firstLine ?? "");
      const extraSpace = hasHeader ? "" : " ";
      const edit: IEditOperation = {
        range: {
          startLineNumber,
          startColumn: 1,
          endLineNumber: startLineNumber,
          endColumn: 1,
        },
        text: `#${extraSpace}`,
      };
      return [[edit], undefined];
    }
  );

const isBold = (text: string): boolean =>
  (text.startsWith("**") && text.endsWith("**")) ||
  (text.startsWith("__") && text.endsWith("__"));

const useBold = (): MarkdownEditorAction =>
  useEditorAction(
    "Bold",
    RiBold,
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB,
    useSurroundAction("**", "**", isBold)
  );

const isItalic = (text: string): boolean =>
  !isBold(text) &&
  ((text.startsWith("*") && text.endsWith("*")) ||
    (text.startsWith("_") && text.endsWith("_")));

const useItalic = (): MarkdownEditorAction =>
  useEditorAction(
    "Italic",
    RiItalic,
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI,
    useSurroundAction("_", "_", isItalic)
  );

const isStrikethrough = (text: string): boolean =>
  text.startsWith("~~") && text.endsWith("~~");

const useStrikethrough = (): MarkdownEditorAction =>
  useEditorAction(
    "Strikethrough",
    RiStrikethrough,
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI,
    useSurroundAction("~~", "~~", isStrikethrough)
  );

const isInlineCode = (text: string): boolean =>
  text.startsWith("`") && text.endsWith("`");

const useInlineCode = (): MarkdownEditorAction =>
  useEditorAction(
    "Inline code",
    RiCodeLine,
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE,
    useSurroundAction("`", "`", isInlineCode)
  );

const runCodeBlock: EditorActionCallback = ({ editor, selection }) => {
  const { startLineNumber, endLineNumber } = selection;
  const firstLine = editor?.getModel()?.getLineContent(startLineNumber) ?? "";
  const lastLine = editor?.getModel()?.getLineContent(endLineNumber) ?? "";
  const isCodeBlock = /^```[!`].*$/.test(firstLine) && lastLine === "```";
  if (isCodeBlock) {
    const edits: IEditOperation[] = [
      {
        range: {
          startLineNumber,
          startColumn: 1,
          endLineNumber: startLineNumber,
          endColumn: firstLine.length,
        },
        text: "",
      },
      {
        range: {
          startLineNumber: endLineNumber,
          startColumn: 1,
          endLineNumber,
          endColumn: firstLine.length,
        },
        text: "",
      },
    ];
    return [edits, undefined];
  }
  const edits: IEditOperation[] = [
    {
      range: {
        startLineNumber,
        startColumn: 1,
        endLineNumber: startLineNumber,
        endColumn: 1,
      },
      text: "```\n",
    },
    {
      range: {
        startLineNumber: endLineNumber + 1,
        startColumn: lastLine.length,
        endLineNumber,
        endColumn: lastLine.length,
      },
      text: "\n```",
    },
  ];
  return [edits, undefined];
};

const useCodeBlock = (): MarkdownEditorAction =>
  useEditorAction(
    "Code block",
    RiCodeBoxLine,
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyE,
    runCodeBlock
  );

const runLink: EditorActionCallback = ({ text, selection }) => {
  const { startLineNumber, endLineNumber, endColumn } = selection;
  const newText = `[${text}]()`;
  const edit: IEditOperation = { range: selection, text: newText };
  const column = endColumn + (startLineNumber === endLineNumber ? 3 : 2);
  const newSelection = new monaco.Selection(
    endLineNumber,
    column,
    endLineNumber,
    column
  );
  return [[edit], [newSelection]];
};

const useLink = (): MarkdownEditorAction =>
  useEditorAction(
    "Link",
    RiLink,
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
    runLink
  );

function* getSelectionLinesGenerator(
  editor: ICodeEditor,
  selection: monaco.Selection
): Generator<string, void> {
  const model = editor?.getModel();
  if (isNil(model)) return;
  for (
    let lineNumber = selection.startLineNumber;
    lineNumber <= selection.endLineNumber;
    lineNumber += 1
  ) {
    yield model.getLineContent(lineNumber);
  }
}

const getSelectionLines = (
  editor: ICodeEditor,
  selection: monaco.Selection
): string[] => [...getSelectionLinesGenerator(editor, selection)];

const decorateEmptyLine = (
  addDecoration: (line: string, lineNumber: number, lines: string[]) => string,
  selection: monaco.Selection
): EditorActionResult => {
  const { startLineNumber, endLineNumber } = selection;
  const text = addDecoration("", 0, [""]);
  const edit = { range: selection, text };
  const newSelection = new monaco.Selection(
    startLineNumber,
    text.length,
    endLineNumber,
    text.length
  );
  return [[edit], [newSelection]];
};

const useDecoratePerLineAction =
  (
    areDecorated: (lines: string[]) => boolean,
    addDecoration: (
      line: string,
      lineNumber: number,
      lines: string[]
    ) => string,
    removeDecoration: (line: string, index: number, lines: string[]) => string
  ): EditorActionCallback =>
  ({ editor, selection }) => {
    const { startLineNumber, endLineNumber, endColumn } = selection;
    const lines = getSelectionLines(editor, selection);
    const isEmpty =
      selection.isEmpty() ||
      (lines.length === 1 && lines[0].trim().length === 0);
    if (isEmpty) {
      return decorateEmptyLine(addDecoration, selection);
    }
    const action = areDecorated(lines) ? removeDecoration : addDecoration;
    const newLines = lines.map(action);
    const newText = newLines.join("\n");
    const edit: IEditOperation = {
      range: { startLineNumber, startColumn: 1, endColumn, endLineNumber },
      text: newText,
    };
    const lastNewLine = newLines[newLines.length - 1];
    const newSelection = new monaco.Selection(
      startLineNumber,
      1,
      endLineNumber,
      lastNewLine.length + 1
    );
    return [[edit], [newSelection]];
  };

const useQuoteAction = (): EditorActionCallback =>
  useDecoratePerLineAction(
    (lines) => lines.every((line) => /^>(\s+\S.*|\s*)/.test(line)),
    (line) => `> ${line}`,
    (line) => /^>(\s+(\S.*)|\s*)/.exec(line)?.[2] ?? ""
  );

const useQuote = (): MarkdownEditorAction =>
  useEditorAction(
    "Quote",
    RiDoubleQuotesL,
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyQ,
    useQuoteAction()
  );

const useBulletedListAction = (): EditorActionCallback =>
  useDecoratePerLineAction(
    (lines) => lines.every((line) => /^[*-](\s+\S.*|\s*)/.test(line)),
    (line) => `* ${line}`,
    (line) => /^[*-](\s+(\S.*)|\s*)/.exec(line)?.[2] ?? ""
  );

const useBulletedList = (): MarkdownEditorAction =>
  useEditorAction(
    "Bulleted list",
    RiListUnordered,
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Digit8,
    useBulletedListAction()
  );

const useNumberedListAction = (): EditorActionCallback =>
  useDecoratePerLineAction(
    (lines) => lines.every((line) => /^\d+\.(\s+\S.*|\s*)/.test(line)),
    (line, index) => `${index + 1}. ${line}`,
    (line) => /^\d+\.(\s+(\S.*)|\s*)/.exec(line)?.[2] ?? ""
  );

const useNumberedList = (): MarkdownEditorAction =>
  useEditorAction(
    "Numbered list",
    RiListOrdered,
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Digit7,
    useNumberedListAction()
  );

export const useCodeEditorActions = (): MarkdownEditorAction[] => [
  useHeader(),
  useBold(),
  useItalic(),
  useStrikethrough(),
  useInlineCode(),
  useCodeBlock(),
  useLink(),
  useQuote(),
  useBulletedList(),
  useNumberedList(),
];
