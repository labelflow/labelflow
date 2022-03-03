import {
  Box,
  Button,
  chakra,
  Flex,
  Kbd,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import {
  MouseEventHandler,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCookies } from "react-cookie";
import { useHotkeys } from "react-hotkeys-hook";
import { RiArrowDownSLine } from "react-icons/ri";
import { Tools, useLabelingStore } from "../../../connectors/labeling-state";
import { keymap } from "../../../keymap";
import { getToolIconName, Icon } from "../../core";
import { IogAlertDialog } from "./iog-alert-dialog";

const ChakraRiArrowDownSLine = chakra(RiArrowDownSLine);

type ToolDefinition = {
  name: string;
  shortcut: string;
};

const DRAWING_TOOLS_DEFINITIONS: Partial<Record<Tools, ToolDefinition>> = {
  [Tools.CLASSIFICATION]: {
    name: "Classification",
    shortcut: keymap.toolClassification.key,
  },
  [Tools.BOX]: {
    name: "Bounding Box",
    shortcut: keymap.toolBoundingBox.key,
  },
  [Tools.POLYGON]: {
    name: "Polygon",
    shortcut: keymap.toolPolygon.key,
  },
  [Tools.FREEHAND]: {
    name: "Freehand",
    shortcut: keymap.toolFreehand.key,
  },
  [Tools.IOG]: {
    name: "Auto-Polygon",
    shortcut: keymap.toolIog.key,
  },
  [Tools.AI_ASSISTANT]: {
    name: "AI Assistant",
    shortcut: keymap.toolAiAssistant.key,
  },
};

// Declared in the actual display order
const DRAWING_TOOLS = [
  Tools.CLASSIFICATION,
  Tools.BOX,
  Tools.POLYGON,
  Tools.FREEHAND,
  Tools.IOG,
  Tools.AI_ASSISTANT,
];

type ToolIconProps = { tool: Tools };

const ToolIcon = ({ tool }: ToolIconProps) => (
  <Box ml="2">
    <Icon name={getToolIconName(tool)} />
  </Box>
);

type ShortcutProps = { shortcut: string };

const Shortcut = ({ shortcut }: ShortcutProps) => (
  <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="2">
    {shortcut}
  </Kbd>
);

type ToolSelectionPopoverItemProps = {
  tool: Tools;
  selected?: boolean;
  onClick: () => void;
};

const getToolDefinition = (tool: Tools): ToolDefinition => {
  const toolDefinition =
    DRAWING_TOOLS_DEFINITIONS[tool] ?? DRAWING_TOOLS_DEFINITIONS.box;
  if (!isNil(toolDefinition)) return toolDefinition;
  throw new Error(`Cannot find definition for tool ${tool}`);
};

export const ToolSelectionPopoverItem = ({
  tool,
  selected,
  onClick,
}: ToolSelectionPopoverItemProps) => {
  const { name, shortcut } = getToolDefinition(tool);
  useHotkeys(shortcut, onClick);
  return (
    <Box
      pl="0"
      pr="0"
      pt="1"
      pb="1"
      role="checkbox"
      aria-label={`${name} tool`}
      aria-checked={selected}
      _hover={{
        backgroundColor: selected
          ? mode("gray.300", "gray.500")
          : mode("gray.100", "gray.600"),
      }}
      bgColor={
        selected
          ? mode("gray.300", "gray.500")
          : mode("transparent", "transparent")
      }
      onClick={onClick}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <ToolIcon tool={tool} />
        <Text flexGrow={1} whiteSpace="nowrap" ml="2" mr="2">
          {name}
        </Text>
        <Shortcut shortcut={shortcut} />
      </Flex>
    </Box>
  );
};

const getTooltipLabel = (lastTool: Tools): string => {
  const { name, shortcut } = getToolDefinition(lastTool);
  return `${name} tool [${shortcut}]`;
};

const LastToolIcon = ({ tool }: ToolIconProps) => (
  <Icon name={getToolIconName(tool)} />
);

export const DrawingToolIcon = (props: {
  isDisabled: boolean;
  selectedTool: Tools;
  setSelectedTool: any;
  onClickDetails: MouseEventHandler<HTMLButtonElement>;
  buttonRef: Ref<HTMLButtonElement>;
}) => {
  const {
    isDisabled,
    onClickDetails,
    selectedTool,
    setSelectedTool,
    buttonRef,
  } = props;
  const [lastTool, setLastTool] = useState(Tools.BOX);
  const isActive = DRAWING_TOOLS.includes(selectedTool);
  useEffect(() => {
    if (!isActive) return;
    setLastTool(selectedTool);
  }, [selectedTool]);
  return (
    <Tooltip
      label={getTooltipLabel(lastTool)}
      placement="right"
      openDelay={300}
    >
      <Button
        ref={buttonRef}
        isDisabled={isDisabled}
        role="checkbox"
        aria-checked={DRAWING_TOOLS.includes(selectedTool)}
        backgroundColor={mode("white", "gray.800")}
        aria-label={`Drawing ${lastTool} tool`}
        pointerEvents="initial"
        onClick={() => setSelectedTool(lastTool)}
        isActive={isActive}
        w="10"
        padding="0"
      >
        <LastToolIcon tool={lastTool} />
        <PopoverTrigger>
          <Button
            as="div"
            variant="link"
            position="absolute"
            right="0"
            bottom="0"
            height="4"
            width="4"
            minWidth="4"
            maxWidth="4"
            isDisabled={isDisabled}
            role="button"
            aria-label="Change Drawing tool"
            pointerEvents="initial"
            onClick={onClickDetails}
            isActive={isActive}
            padding="0"
            textAlign="right"
            color={mode("gray.800", "gray.200")}
          >
            <ChakraRiArrowDownSLine
              position="relative"
              size="0.7em"
              transform="translate( 0.01em, 0.01em) rotate(-45deg) scale(2) "
            />
          </Button>
        </PopoverTrigger>
      </Button>
    </Tooltip>
  );
};

export const DrawingTool = () => {
  const isImageLoading = useLabelingStore((state) => state.isImageLoading);
  const selectedTool = useLabelingStore((state) => state.selectedTool);
  const setSelectedTool = useLabelingStore((state) => state.setSelectedTool);
  const setSelectedLabelId = useLabelingStore(
    (state) => state.setSelectedLabelId
  );
  const [isPopoverOpened, doSetIsPopoverOpened] = useState(false);
  const [isIogAlertDialogOpen, doSetIsIogAlertDialogOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const setIsPopoverOpened = useCallback((newState) => {
    doSetIsPopoverOpened(newState);
    if (!newState && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);
  const [{ hasUserAcceptedIog }, setHasUserAcceptedIog] = useCookies([
    "hasUserAcceptedIog",
  ]);

  useEffect(() => {
    if (selectedTool !== Tools.SELECTION) {
      setSelectedLabelId(null);
    }
    if (selectedTool === Tools.IOG) {
      if (hasUserAcceptedIog !== "true") {
        doSetIsIogAlertDialogOpen(true);
      }
    }
  }, [selectedTool]);
  return (
    <>
      <IogAlertDialog
        isOpen={isIogAlertDialogOpen}
        onClose={() => {
          doSetIsIogAlertDialogOpen(false);
        }}
        onAccept={() => {
          setHasUserAcceptedIog("hasUserAcceptedIog", "true", {
            path: "/",
            httpOnly: false,
          });
        }}
        onCancel={() => {
          setSelectedTool(Tools.SELECTION);
        }}
      />
      <Popover
        isOpen={isPopoverOpened}
        placement="right-start"
        closeOnBlur
        onClose={() => {
          setIsPopoverOpened(false);
        }}
      >
        <DrawingToolIcon
          buttonRef={buttonRef}
          isDisabled={isImageLoading}
          onClickDetails={(e) => {
            setIsPopoverOpened(!isPopoverOpened);
            e.stopPropagation();
          }}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
        <PopoverContent
          borderColor={mode("gray.200", "gray.600")}
          cursor="default"
          pointerEvents="initial"
          aria-label="Change Drawing Tool"
          width="60"
        >
          <PopoverBody pl="0" pr="0">
            <Box>
              {DRAWING_TOOLS.map((tool) => (
                <ToolSelectionPopoverItem
                  key={tool}
                  tool={tool}
                  selected={selectedTool === tool}
                  onClick={() => {
                    setSelectedTool(tool);
                    setIsPopoverOpened(false);
                  }}
                />
              ))}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
