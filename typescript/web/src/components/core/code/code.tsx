import {
  Box,
  BoxProps,
  chakra,
  IconButton,
  IconButtonProps,
  useBoolean,
  useColorModeValue,
} from "@chakra-ui/react";
import { CSSProperties, PropsWithChildren, useCallback } from "react";
import { RiFileCopyLine } from "react-icons/ri";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

const CopyIcon = chakra(RiFileCopyLine);

export type CodeProps = BoxProps & {
  language?: string;
  inline?: boolean;
};

export type CopyButtonProps = { value: string } & Omit<
  IconButtonProps,
  "onClick" | "aria-label" | "icon"
>;

export const CopyButton = ({ value, ...props }: CopyButtonProps) => {
  const handleClick = useCallback(
    () => navigator.clipboard.writeText(value),
    [value]
  );
  return (
    <IconButton
      data-testid="copy-code-button"
      {...props}
      aria-label="Copy to clipboard"
      icon={<CopyIcon fontSize="md" />}
      onClick={handleClick}
    />
  );
};

type SyntaxHighlighterPreProps = PropsWithChildren<{}> &
  Pick<CodeProps, "inline"> &
  Pick<CopyButtonProps, "value"> &
  BoxProps;

const SyntaxHighlighterPre = ({
  value,
  inline,
  children: preChildren,
  ...preProps
}: SyntaxHighlighterPreProps) => {
  const [hovering, setHovering] = useBoolean(false);
  const showCopy = !inline && hovering && navigator.clipboard;
  return (
    <Box
      data-testid="code-box"
      {...preProps}
      as={inline ? "span" : undefined}
      mt="0"
      mb="0"
      onMouseEnter={setHovering.on}
      onMouseLeave={setHovering.off}
      position="relative"
    >
      {preChildren}
      {showCopy && (
        <CopyButton position="absolute" top=".5em" right=".5em" value={value} />
      )}
    </Box>
  );
};

const useSyntaxHighlighterPre =
  (value: string, inline: boolean) =>
  (props: Omit<SyntaxHighlighterPreProps, "value" | "inline">) =>
    <SyntaxHighlighterPre value={value} inline={inline} {...props} />;

const useSyntaxHighlighterProps = (
  inline: boolean
): [unknown, CSSProperties] => [
  useColorModeValue(vs, vscDarkPlus),
  {
    // FIXME Find a way to reuse Chakra variables here
    background: useColorModeValue("#EAEAEA", "#333333"),
    borderStyle: "none",
    borderRadius: "var(--chakra-radii-sm)",
    padding: inline ? ".5em" : "1em",
    fontSize: "16px",
  },
];

export const Code = ({ language, inline = false, children }: CodeProps) => {
  const [style, customStyle] = useSyntaxHighlighterProps(inline);
  return (
    <SyntaxHighlighter
      language={language}
      style={style}
      customStyle={customStyle}
      PreTag={useSyntaxHighlighterPre(String(children), inline)}
    >
      {children}
    </SyntaxHighlighter>
  );
};
