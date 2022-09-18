import monaco from "monaco-editor";

/**
 * Default Monaco editor options
 * @remarks Fine-tuned to look as-close-as possible of a RichText input
 */
export const DEFAULT_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    lineDecorationsWidth: 10,
    padding: { top: 10 },
    lineNumbers: "off",
    folding: false,
    minimap: { enabled: false },
    renderLineHighlight: "none",
    occurrencesHighlight: false,
    scrollBeyondLastLine: false,
    colorDecorators: true,
    dragAndDrop: true,
    insertSpaces: true,
    renderWhitespace: "trailing",
    tabSize: 2,
    wordWrap: "on",
    // renderValidationDecorations: "on",
    // glyphMargin: true,
    // lineNumbers: "on",
  };

/** URL to the help page which is opened when clicking on the Markdown icon */
export const MARKDOWN_HELP_URL =
  "https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax";

/** Minimal delay before re-rendering while typing */
export const MARKDOWN_INPUT_DEBOUNCE_DELAY = 1000;

/** Maximum time between 2 re-renderings */
export const MARKDOWN_INPUT_DEBOUNCE_MAX_WAIT = 5000;
