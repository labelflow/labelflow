import {
  Box,
  chakra,
  Checkbox,
  Code as ChakraCode,
  Divider,
  Heading,
  HeadingProps,
  Image,
  Link,
  ListItem,
  ListProps,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  useBoolean,
} from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { PropsWithChildren } from "react";
import { RiLink } from "react-icons/ri";
import { Components as MdComponents } from "react-markdown";
import {
  CodeProps as MdCodeProps,
  HeadingProps as MdHeadingProps,
  LiProps as MdLiProps,
  OrderedListProps as MdOrderedListProps,
  TableCellProps as MdTableCellProps,
  TableRowProps as MdTableRowProps,
  UnorderedListProps as MdUnorderedListProps,
} from "react-markdown/lib/ast-to-react";
import { Code } from "../code";
import { useMarkdown } from "./markdown.context";

const LinkIcon = chakra(RiLink);

type HeadingLinkProps = {
  headingId?: string;
  show: boolean;
};

const HeadingLink = ({ headingId, show }: HeadingLinkProps) => {
  const [hovered, setHovered] = useBoolean(false);
  return (
    <Box
      position="absolute"
      lineHeight="1"
      top=".25em"
      left="-18px"
      height="100%"
      width="18px"
      onMouseEnter={setHovered.on}
      onMouseLeave={setHovered.off}
    >
      <Link href={`#${headingId}`} hidden={!show && !hovered}>
        <LinkIcon fontSize="md" />
      </Link>
    </Box>
  );
};

const MdHeading = ({ level, children, id, sourcePosition }: MdHeadingProps) => {
  const [hovered, setHovered] = useBoolean(false);
  const sizes = ["2xl", "xl", "lg", "md", "sm", "xs"];
  // {...getCoreProps(props)}
  const as: HeadingProps["as"] =
    level > 0 && level < 7 ? (`h${level}` as HeadingProps["as"]) : "h6";
  const { headingLinks } = useMarkdown();
  const showLink = headingLinks && level > 0 && level < 4 && hovered;
  const isH1OrH2 = level > 0 && level < 3;
  return (
    <Box mb="1em">
      <Heading
        id={id}
        mt={sourcePosition?.start.line === 1 ? undefined : "1em"}
        mb={isH1OrH2 ? ".25em" : "1em"}
        as={as}
        size={sizes[level - 1]}
        onMouseEnter={setHovered.on}
        onMouseLeave={setHovered.off}
        position="relative"
      >
        <HeadingLink headingId={id} show={showLink} />
        <Text>{children}</Text>
      </Heading>
      {isH1OrH2 && <Divider />}
    </Box>
  );
};

/* {...getCoreProps(props)} */
const MdPre = ({ children }: PropsWithChildren<{}>) => (
  <chakra.pre>{children}</chakra.pre>
);

const MdP = ({ children }: PropsWithChildren<{}>) => (
  <Text mb={2}>{children}</Text>
);

const MdEm = ({ children }: PropsWithChildren<{}>) => (
  <Text as="em">{children}</Text>
);

const MdBlockquote = ({ children }: PropsWithChildren<{}>) => (
  <ChakraCode as="blockquote" p={2}>
    {children}
  </ChakraCode>
);

const MdCode = ({ inline, children, className }: MdCodeProps) => {
  const language =
    !isNil(className) && className.startsWith("language-")
      ? className.substring(9)
      : "text";
  return (
    <Code className={className} language={language} inline={inline}>
      {children}
    </Code>
  );
};

const MdDel = ({ children }: PropsWithChildren<{}>) => (
  <Text as="del">{children}</Text>
);

const MdHr = () => <Divider />;

const MdUl = ({
  ordered,
  children,
  depth,
}: MdUnorderedListProps | MdOrderedListProps) => {
  // const attrs = getCoreProps(props);
  const ulStyleType = () => (depth === 1 ? "circle" : "disc");
  const styleType = ordered ? "decimal" : ulStyleType();
  // {...attrs}
  const props: ListProps = {
    spacing: 2,
    as: ordered ? "ol" : "ul",
    styleType,
    pl: 4,
  };
  return ordered ? (
    <OrderedList {...props}>{children}</OrderedList>
  ) : (
    <UnorderedList {...props}>{children}</UnorderedList>
  );
};

const MdText = ({ children }: PropsWithChildren<{}>) => (
  <Text as="span">{children}</Text>
);

const MdLi = ({ children, checked }: MdLiProps) => {
  let checkbox = null;
  if (!isNil(checked)) {
    checkbox = (
      <Checkbox isChecked={checked} isReadOnly>
        {children}
      </Checkbox>
    );
  }
  // {...getCoreProps(props)}
  return (
    <ListItem listStyleType={checked !== null ? "none" : "inherit"}>
      {checkbox || children}
    </ListItem>
  );
};

const MdTd = ({ children }: MdTableCellProps) => <Td>{children}</Td>;

const MdTh = ({ children }: MdTableCellProps) => <Th>{children}</Th>;

const MdTr = ({ children }: MdTableRowProps) => <Tr>{children}</Tr>;

export const MARKDOWN_COMPONENTS: MdComponents = {
  a: Link,
  blockquote: MdBlockquote,
  code: MdCode,
  del: MdDel,
  em: MdEm,
  h1: MdHeading,
  h2: MdHeading,
  h3: MdHeading,
  h4: MdHeading,
  h5: MdHeading,
  h6: MdHeading,
  hr: MdHr,
  img: Image,
  li: MdLi,
  ol: MdUl,
  p: MdP,
  pre: MdPre,
  table: Table,
  tbody: Tbody,
  td: MdTd,
  text: MdText,
  th: MdTh,
  thead: Thead,
  tr: MdTr,
  ul: MdUl,
};
