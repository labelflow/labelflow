import monaco from "monaco-editor";

/** Default height in px to be used by the Monaco editor */
export const MIN_CODE_EDITOR_HEIGHT = 150;

/** Default Monaco editor options */
export const DEFAULT_CODE_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    occurrencesHighlight: false,
    scrollBeyondLastLine: false,
    colorDecorators: true,
    dragAndDrop: true,
    insertSpaces: true,
    renderWhitespace: "all",
    tabSize: 2,
    wordWrap: "on",
  };
