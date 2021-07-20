import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Ref,
  MouseEventHandler,
} from "react";
import {
  Tooltip,
  Popover,
  PopoverContent,
  Button,
  PopoverBody,
  PopoverTrigger,
  Box,
  Kbd,
  Flex,
  Text,
  chakra,
} from "@chakra-ui/react";
import { RiArrowDownSLine } from "react-icons/ri";
import { BiShapePolygon, BiShapeSquare } from "react-icons/bi";
import { useHotkeys } from "react-hotkeys-hook";

import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

import { keymap } from "../../../keymap";

export type Props = {};

const ChakraBiShapeSquare = chakra(BiShapeSquare);
const ChakraBiShapePolygon = chakra(BiShapePolygon);
const ChakraRiArrowDownSLine = chakra(RiArrowDownSLine);

export const ToolSelectionPopoverItem = (props: {
  name: string;
  shortcut: string;
  selected?: boolean;
  onClick: any;
  children: any;
  ariaLabel: string;
}) => {
  const { name, shortcut, selected, children, onClick, ariaLabel } = props;

  return (
    <Box
      pl="0"
      pr="0"
      pt="1"
      pb="1"
      role="navigation"
      aria-label={ariaLabel}
      _hover={{
        backgroundColor: selected ? "gray.300" : "gray.100",
      }}
      bgColor={selected ? "gray.300" : "transparent"}
      onClick={() => {
        onClick();
      }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        {children}
        <Text flexGrow={1} whiteSpace="nowrap" ml="2" mr="2">
          {name}
        </Text>

        <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="2">
          {shortcut}
        </Kbd>
      </Flex>
    </Box>
  );
};

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
  useEffect(() => {
    if ([Tools.BOX, Tools.POLYGON].includes(selectedTool)) {
      setLastTool(selectedTool);
    }
  }, [selectedTool]);
  const isActive = [Tools.BOX, Tools.POLYGON].includes(selectedTool);
  const toolTipLabel = (() => {
    if (lastTool === Tools.BOX) {
      return `Bounding Box tool [${keymap.toolBoundingBox.key}]`;
    }
    return `Polygon tool [${keymap.toolPolygon.key}]`;
  })();
  // console.log(`selected tool = ${selectedTool}`);
  return (
    <Tooltip label={toolTipLabel} placement="right" openDelay={300}>
      <Button
        ref={buttonRef}
        isDisabled={isDisabled}
        role="checkbox"
        aria-checked={[Tools.BOX, Tools.POLYGON].includes(selectedTool)}
        backgroundColor="white"
        aria-label={`Drawing ${lastTool} tool`}
        pointerEvents="initial"
        onClick={() => setSelectedTool(lastTool)}
        isActive={isActive}
        w="10"
        padding="0"
      >
        {lastTool === Tools.BOX ? (
          <ChakraBiShapeSquare size="1.3em" />
        ) : (
          <ChakraBiShapePolygon size="1.3em" />
        )}

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
            color="gray.800"
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
  // console.log(window);
  const isImageLoading = useLabellingStore((state) => state.isImageLoading);
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedTool = useLabellingStore((state) => state.setSelectedTool);
  const [isPopoverOpened, doSetIsPopoverOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const setIsPopoverOpened = useCallback((newState) => {
    doSetIsPopoverOpened(newState);
    if (!newState && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  useHotkeys(
    keymap.toolBoundingBox.key,
    () => {
      setSelectedTool(Tools.BOX);
    },
    {},
    []
  );
  useHotkeys(
    keymap.toolPolygon.key,
    () => setSelectedTool(Tools.POLYGON),
    {},
    []
  );
  return (
    <>
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
          borderColor="gray.200"
          cursor="default"
          pointerEvents="initial"
          aria-label="Change Drawing Tool"
          width="60"
        >
          <PopoverBody pl="0" pr="0">
            <Box>
              <ToolSelectionPopoverItem
                name="Bounding Box"
                shortcut={keymap.toolBoundingBox.key}
                selected={selectedTool === Tools.BOX}
                onClick={() => {
                  setSelectedTool(Tools.BOX);
                  setIsPopoverOpened(false);
                }}
                ariaLabel="Select bounding box tool"
              >
                <Box ml="2">
                  <BiShapeSquare size="1.3em" />
                </Box>
              </ToolSelectionPopoverItem>
              <ToolSelectionPopoverItem
                name="Polygon"
                shortcut={keymap.toolPolygon.key}
                selected={selectedTool === Tools.POLYGON}
                onClick={() => {
                  setSelectedTool(Tools.POLYGON);
                  setIsPopoverOpened(false);
                }}
                ariaLabel="Select polygon tool"
              >
                <Box ml="2">
                  <BiShapePolygon size="1.3em" />
                </Box>
              </ToolSelectionPopoverItem>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
