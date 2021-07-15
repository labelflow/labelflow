import { useState } from "react";
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
} from "@chakra-ui/react";
import { RiCheckboxBlankLine } from "react-icons/ri";
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
  const [bgColor, setBgColor] = useState(defaultBgColor);
  return (
    <Box
      pl="3"
      pr="3"
      pt="1"
      pb="1"
      bgColor={bgColor}
      onMouseEnter={() => {
        if (!selected) {
          setBgColor("gray.100");
        }
      }}
      onMouseLeave={() => setBgColor(defaultBgColor)}
      onClick={onClick}
    >
      <Flex justifyContent="space-between" alignItems="center">
        {children}
        <Text
          flexGrow={1}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          ml="2"
          mr="2"
        >
          {name}
        </Text>

        <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="2">
          {shortcut}
        </Kbd>
      </Flex>
    </Box>
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
      <Popover isOpen={isPopoverOpened} placement="right-start">
        <PopoverTrigger>
          <Tooltip
            label={`Drawing tool [${keymap.toolBoundingBox.key}]`}
            placement="right-start"
            openDelay={300}
          >
            <IconButton
              icon={<RiCheckboxBlankLine size="1.3em" />}
              isDisabled={isImageLoading}
              role="checkbox"
              aria-checked={selectedTool === Tools.BOX}
              backgroundColor="white"
              aria-label="Drawing tool"
              pointerEvents="initial"
              onClick={() => setIsPopoverOpened(!isPopoverOpened)}
              isActive={selectedTool === Tools.BOX}
            />
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent
          borderColor="gray.200"
          cursor="default"
          pointerEvents="initial"
          aria-label="changeme"
        >
          <PopoverBody pl="0" pr="0" pt="0">
            <Box>
              <ToolSelectionPopoverItem
                name="Polygon"
                shortcut="P"
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
                name="Bounding box"
                shortcut="B"
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
      {/* <Tooltip
        label={`Drawing tool [${keymap.toolBoundingBox.key}]`}
        placement="right"
        openDelay={300}
      >
        <IconButton
          icon={<RiCheckboxBlankLine size="1.3em" />}
          isDisabled={isImageLoading}
          role="checkbox"
          aria-checked={selectedTool === Tools.BOX}
          backgroundColor="white"
          aria-label="Drawing tool"
          pointerEvents="initial"
          onClick={() => setSelectedTool(Tools.BOX)}
          isActive={selectedTool === Tools.BOX}
        />
      </Tooltip>
      <Tooltip
        label={`Drawing tool [${keymap.toolPolygon.key}]`}
        placement="right"
        openDelay={300}
      >
        <IconButton
          icon={<FaDrawPolygon size="1.3em" />}
          isDisabled={isImageLoading}
          role="checkbox"
          aria-checked={selectedTool === Tools.POLYGON}
          backgroundColor="white"
          aria-label="Drawing tool"
          pointerEvents="initial"
          onClick={() => setSelectedTool(Tools.POLYGON)}
          isActive={selectedTool === Tools.POLYGON}
        />
      </Tooltip> */}
    </>
  );
};
