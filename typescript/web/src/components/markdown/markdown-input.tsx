import {
  Box,
  BoxProps,
  chakra,
  CSSObject,
  HStack,
  Tab,
  TabList as ChakraTabList,
  TabPanel,
  TabPanelProps,
  TabPanels as ChakraTabPanels,
  Tabs,
  TabsProps,
  Text,
  Tooltip,
  useStyleConfig,
} from "@chakra-ui/react";
import { IoWarningOutline } from "react-icons/io5";
import { RiMarkdownLine } from "react-icons/ri";
import { DropZone } from "../drop-zone";
import { FullScreen, FullScreenProvider, useFullScreen } from "../full-screen";
import { MarkdownInputEditor } from "./markdown-input-editor";
import { MarkdownInputPreview } from "./markdown-input-preview";
import { MarkdownInputToolbar } from "./markdown-input-toolbar";
import { MARKDOWN_HELP_URL } from "./markdown.constants";
import {
  MarkdownInputProps,
  MarkdownInputProvider,
  useMarkdownInput,
} from "./markdown-input.context";

export const useButtonStyle = (): CSSObject =>
  useStyleConfig("Button", { variant: "outline" });

const MarkdownIcon = chakra(RiMarkdownLine);
const ProblemsIcon = chakra(IoWarningOutline);

const TabList = () => (
  <ChakraTabList>
    <Tab>Edit</Tab>
    <Tab>Preview</Tab>
    <MarkdownInputToolbar alignSelf="center" marginLeft="auto" />
  </ChakraTabList>
);

const FOOTER_ITEM_PROPS: Omit<BoxProps, "onClick" | "onDrop"> = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
};

const UploadInput = () => {
  const { uploadFiles } = useMarkdownInput();
  return (
    <DropZone
      {...FOOTER_ITEM_PROPS}
      left="0"
      right="0"
      textAlign="center"
      onDrop={uploadFiles}
    >
      <Text>
        Attach files by dragging & dropping, selecting or pasting them.
      </Text>
    </DropZone>
  );
};

const ProblemsField = () => {
  const { errors } = useMarkdownInput();
  return (
    <Tooltip label={`${errors.length} problems`}>
      <HStack align="center" spacing=".25em" color="yellow.500">
        <ProblemsIcon fontSize="2xl" />
        <Text>{errors.length}</Text>
      </HStack>
    </Tooltip>
  );
};

const Problems = () => {
  const { errors } = useMarkdownInput();
  return (
    <>
      {errors.length > 0 && (
        <Box {...FOOTER_ITEM_PROPS} left="0" pl=".5em">
          <ProblemsField />
        </Box>
      )}
    </>
  );
};

const handleClickHelp = () => window.open(MARKDOWN_HELP_URL, "_blank");

const MarkdownHelp = () => (
  <Box
    {...FOOTER_ITEM_PROPS}
    right="0"
    pr=".25em"
    cursor="pointer"
    onClick={handleClickHelp}
  >
    <Tooltip label="Styling with Markdown is supported">
      <span>
        <MarkdownIcon fontSize="2xl" />
      </span>
    </Tooltip>
  </Box>
);

const Footer = () => {
  const { borderColor } = useButtonStyle();
  return (
    <Box
      position="relative"
      fontSize="sm"
      borderTop="1px"
      p=".125em"
      sx={{ borderColor }}
      height="2.25em"
      userSelect="none"
    >
      <UploadInput />
      <Problems />
      <MarkdownHelp />
    </Box>
  );
};

const EditTabPanel = (props: TabPanelProps) => {
  const { fullScreen } = useFullScreen();
  return (
    <TabPanel
      p="0"
      flexGrow={1}
      display="flex"
      flexDirection="column"
      {...props}
    >
      <MarkdownInputEditor
        resize={fullScreen ? "none" : "vertical"}
        flexGrow={1}
      />
      <Footer />
    </TabPanel>
  );
};

const PreviewTabPanel = (props: TabPanelProps) => (
  <TabPanel
    flexGrow={1}
    display="flex"
    flexDirection="column"
    minHeight={0}
    overflowY="auto"
    {...props}
  >
    <MarkdownInputPreview />
  </TabPanel>
);

const TabPanels = () => {
  const { borderColor } = useButtonStyle();
  return (
    <ChakraTabPanels
      roundedBottom="md"
      borderLeft="1px"
      borderRight="1px"
      borderBottom="1px"
      mt="1px"
      sx={{ borderColor }}
      flexGrow={1}
      display="flex"
      flexDirection="column"
      minHeight={0}
    >
      <EditTabPanel />
      <PreviewTabPanel />
    </ChakraTabPanels>
  );
};

const MarkdownInputComponent = () => {
  const { fullScreen } = useFullScreen();
  const props: Omit<TabsProps, "children"> = fullScreen
    ? { height: "100%", width: "100%", padding: "1em", overflowY: "auto" }
    : { maxWidth: "3xl" };
  return (
    <Tabs
      variant="enclosed"
      display="flex"
      flexDirection="column"
      minHeight={0}
      {...props}
    >
      <TabList />
      <TabPanels />
    </Tabs>
  );
};

export const MarkdownInput = (props: MarkdownInputProps) => (
  <FullScreenProvider>
    <MarkdownInputProvider {...props}>
      <FullScreen>
        <MarkdownInputComponent />
      </FullScreen>
    </MarkdownInputProvider>
  </FullScreenProvider>
);
