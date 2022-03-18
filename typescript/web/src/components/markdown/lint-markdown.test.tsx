import {
  Renderer,
  renderHook,
  RenderHookResult,
} from "@testing-library/react-hooks";
import { LintError } from "markdownlint";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { lintMarkdown, useLintMarkdown } from "./lint-markdown";

const VALID_MARKDOWN = "# Top-level h1\n";

const INVALID_MARKDOWN = "## Top-level h2\n";

const INVALID_MARKDOWN_ERROR = {
  errorContext: "## Top-level h2",
  lineNumber: 1,
  ruleDescription: "First line in a file should be a top-level heading",
  ruleNames: ["MD041", "first-line-heading", "first-line-h1"],
};

const UseLintMarkdownWrapper = ({ children }: PropsWithChildren<{}>) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

type RenderUseLintMarkdownProps = { text: string };

type RenderUseLintMarkdownResult = [
  RenderHookResult<
    RenderUseLintMarkdownProps,
    LintError[],
    Renderer<RenderUseLintMarkdownProps>
  >,
  jest.Mock
];

const renderUseLintMarkdown = (): RenderUseLintMarkdownResult => {
  const onChange = jest.fn();
  const result = renderHook<RenderUseLintMarkdownProps, LintError[]>(
    ({ text }) => useLintMarkdown(text, { onChange }),
    { initialProps: { text: VALID_MARKDOWN }, wrapper: UseLintMarkdownWrapper }
  );
  return [result, onChange];
};

const expectValid = (errors: LintError[]): void => {
  expect(errors).toHaveLength(0);
};

const expectInvalid = (errors: LintError[]): void => {
  expect(errors).toHaveLength(1);
  expect(errors[0]).toMatchObject(INVALID_MARKDOWN_ERROR);
};

describe("lintMarkdown", () => {
  it("returns an empty array when there is no problem", async () => {
    expectValid(await lintMarkdown(VALID_MARKDOWN));
  });

  it("returns errors when they are linting problems", async () => {
    expectInvalid(await lintMarkdown(INVALID_MARKDOWN));
  });
});

describe("useLintMarkdown", () => {
  it("calls onChange when they are new errors results", async () => {
    const [{ result, waitForNextUpdate, rerender }, onChange] =
      renderUseLintMarkdown();
    expectValid(result.current);
    await waitForNextUpdate();
    expectValid(result.current);
    expect(onChange).toHaveBeenCalledTimes(1);
    onChange.mockClear();
    rerender({ text: INVALID_MARKDOWN });
    expectValid(result.current);
    await waitForNextUpdate();
    expectInvalid(result.current);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.arrayContaining([expect.objectContaining(INVALID_MARKDOWN_ERROR)])
    );
  });
});
