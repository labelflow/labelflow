import { Box, BoxProps, chakra } from "@chakra-ui/react";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import MathJax from "react-mathjax";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
// import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MARKDOWN_COMPONENTS } from "./markdown.components";
import { MarkdownProvider, MarkdownProviderProps } from "./markdown.context";

type MathProps = {
  value: string;
  inline?: boolean;
};

const Math = ({ value, inline }: MathProps) => {
  return <MathJax.Node formula={value} inline={inline} />;
};

type InlineMathProps = Pick<MathProps, "value">;

const InlineMath = (props: InlineMathProps) => <Math {...props} inline />;

const MARKDOWN_RENDERERS = {
  math: Math,
  inlineMath: InlineMath,
};

const ChakraMarkdown = chakra(ReactMarkdown);

type MarkdownComponentProps = { value: string };

const MarkdownComponent = ({ value }: MarkdownComponentProps) => (
  <MathJax.Provider>
    <ChakraMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={{ ...MARKDOWN_COMPONENTS, ...MARKDOWN_RENDERERS }}
      rawSourcePos
    >
      {value}
    </ChakraMarkdown>
  </MathJax.Provider>
);

const MemoizedMarkdown = ({ value }: MarkdownComponentProps) =>
  useMemo(() => <MarkdownComponent value={value} />, [value]);

export type MarkdownProps = MarkdownComponentProps &
  BoxProps &
  MarkdownProviderProps;

export const Markdown = ({ value, headingLinks, ...props }: MarkdownProps) => (
  <Box {...props} p=".5em">
    <MarkdownProvider headingLinks={headingLinks}>
      <MemoizedMarkdown value={value} />
    </MarkdownProvider>
  </Box>
);
