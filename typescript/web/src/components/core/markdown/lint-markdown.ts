import { isEmpty, isNil } from "lodash/fp";
import markdownlint, {
  Configuration as MdLintConfig,
  LintError,
  Options as MdLintOptions,
} from "markdownlint";
import { useQuery } from "react-query";

const DEFAULT_MARKDOWNLINT_CONFIG: MdLintConfig = {
  default: true,
};

export const lintMarkdown = async (text: string): Promise<LintError[]> => {
  const options: MdLintOptions = {
    config: DEFAULT_MARKDOWNLINT_CONFIG,
    strings: { text },
  };
  return await new Promise((resolve, reject) =>
    markdownlint(options, (error, result) => {
      if (!isNil(error) || isNil(result)) {
        reject(error ?? "Markdown linter returned an undefined result");
        return;
      }
      resolve(result.text);
    })
  );
};

export type UseLintMarkdownOptions = {
  skip?: boolean;
  onChange?: (errors: LintError[]) => void;
};

const useLintMarkdownQuery = (
  text: string,
  { skip, onChange }: UseLintMarkdownOptions
) =>
  useQuery("lint-markdown", () => lintMarkdown(text), {
    enabled: !skip,
    onSuccess: onChange,
    onError: (error) => {
      throw error;
    },
    keepPreviousData: true,
  });

export const useLintMarkdown = (
  text: string,
  options?: UseLintMarkdownOptions
): LintError[] => {
  const { skip = false, ...remainingOptions } = options ?? {};
  const empty = isEmpty(text);
  const { data } = useLintMarkdownQuery(text, {
    skip: empty || skip,
    ...remainingOptions,
  });
  return empty ? [] : data ?? [];
};
