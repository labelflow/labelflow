import { useState, useEffect } from "react";
import {
  IconButton,
  Tooltip,
  Popover,
  PopoverContent,
  PopoverBody,
  PopoverTrigger,
  Box,
  Kbd,
  Flex,
  Text,
  ButtonGroup,
} from "@chakra-ui/react";
import { RiCheckboxBlankLine, RiArrowDownSLine } from "react-icons/ri";
import { FaDrawPolygon } from "react-icons/fa";
import { useHotkeys } from "react-hotkeys-hook";

import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

import { keymap } from "../../../keymap";

export type Props = {};

export const ToolSelectionPopoverItem = (props: {
  name: string;
  shortcut: string;
  selected?: boolean;
  onClick: any;
  children: any;
}) => {
  const { name, shortcut, selected, children, onClick } = props;
  const defaultBgColor = selected ? "gray.300" : "transparent";
  const [highlight, setHighlight] = useState(false);
  return (
    <Box
      pl="0"
      pr="0"
      pt="1"
      pb="1"
      bgColor={highlight ? "gray.100" : defaultBgColor}
      onMouseEnter={() => {
        if (!selected) {
          setHighlight(true);
        }
      }}
      onMouseLeave={() => {
        if (!selected) {
          setHighlight(false);
        }
      }}
      onClick={() => {
        setHighlight(false);
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
  onClick: any;
}) => {
  const { isDisabled, onClick, selectedTool, setSelectedTool } = props;
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
  const bgColor = (() => {
    if (isDisabled) {
      return "transparent";
    }
    if (isActive) {
      return "gray.300";
    }
    return "white";
  })();
  return (
    <Tooltip label={toolTipLabel} placement="right-start" openDelay={300}>
      <Box bgColor={bgColor} borderRadius="7px">
        <ButtonGroup alignItems="flex-end" isAttached>
          <IconButton
            icon={
              lastTool === Tools.BOX ? (
                <RiCheckboxBlankLine size="1.3em" />
              ) : (
                <FaDrawPolygon size="1.3em" />
              )
            }
            isDisabled={isDisabled}
            role="checkbox"
            aria-checked={selectedTool === Tools.BOX}
            backgroundColor="white"
            aria-label="Drawing tool"
            pointerEvents="initial"
            onClick={() => setSelectedTool(lastTool)}
            isActive={isActive}
          />
          <PopoverTrigger>
            <IconButton
              icon={<RiArrowDownSLine size="1.3em" />}
              isDisabled={isDisabled}
              role="checkbox"
              aria-checked={selectedTool === Tools.BOX}
              backgroundColor="white"
              aria-label="Drawing tool"
              pointerEvents="initial"
              onClick={onClick}
              isActive={isActive}
              size="xs"
            />
          </PopoverTrigger>
        </ButtonGroup>
      </Box>
    </Tooltip>
  );
};

export const DrawingTool = () => {
  const isImageLoading = useLabellingStore((state) => state.isImageLoading);
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedTool = useLabellingStore((state) => state.setSelectedTool);
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);

  useHotkeys(
    keymap.toolBoundingBox.key,
    () => setSelectedTool(Tools.BOX),
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
          isDisabled={isImageLoading}
          onClick={() => setIsPopoverOpened(!isPopoverOpened)}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
        <PopoverContent
          borderColor="gray.200"
          cursor="default"
          pointerEvents="initial"
          aria-label="changeme"
          width="60"
        >
          <PopoverBody pl="0" pr="0" pt="0">
            <Box>
              <ToolSelectionPopoverItem
                name="Polygon"
                shortcut={keymap.toolPolygon.key}
                selected={selectedTool === Tools.POLYGON}
                onClick={() => {
                  setSelectedTool(Tools.POLYGON);
                  setIsPopoverOpened(false);
                }}
              >
                <Box ml="2">
                  <FaDrawPolygon size="1.3em" />
                </Box>
              </ToolSelectionPopoverItem>
              <ToolSelectionPopoverItem
                name="Bounding Box"
                shortcut={keymap.toolBoundingBox.key}
                selected={selectedTool === Tools.BOX}
                onClick={() => {
                  setSelectedTool(Tools.BOX);
                  setIsPopoverOpened(false);
                }}
              >
                <Box ml="2">
                  <RiCheckboxBlankLine size="1.3em" />
                </Box>
              </ToolSelectionPopoverItem>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
