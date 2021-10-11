import React from "react";
import {
  IconButton,
  chakra,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";
import { useHotkeys } from "react-hotkeys-hook";

import { useLabellingStore } from "../../../connectors/labelling-state";
import { keymap } from "../../../keymap";

const ZoomOutIcon = chakra(RiZoomOutLine);
const ZoomInIcon = chakra(RiZoomInLine);

export const ZoomTool = () => {
  const canZoomIn = useLabellingStore((state) => state.canZoomIn);
  const canZoomOut = useLabellingStore((state) => state.canZoomOut);
  const zoomByDelta = useLabellingStore((state) => state.zoomByDelta);
  const zoomFactor = useLabellingStore((state) => state.zoomFactor);

  useHotkeys(
    keymap.zoomIn.key,
    () => {
      if (canZoomIn) {
        zoomByDelta(zoomFactor);
      }
    },
    { splitKey: "/" },
    [canZoomIn, zoomFactor]
  );

  useHotkeys(
    keymap.zoomOut.key,
    () => {
      if (canZoomIn) {
        zoomByDelta(-zoomFactor);
      }
    },
    { splitKey: "/" },
    [canZoomOut, zoomFactor]
  );

  return (
    <>
      <Tooltip
        label={`Zoom In [${keymap.zoomIn.key}]`}
        placement="left"
        openDelay={300}
      >
        <IconButton
          icon={<ZoomInIcon fontSize="lg" />}
          backgroundColor={mode("white", "gray.800")}
          aria-label="Zoom in"
          pointerEvents="initial"
          isDisabled={!canZoomIn}
          onClick={() => {
            zoomByDelta(zoomFactor);
          }}
        />
      </Tooltip>
      <Tooltip
        label={`Zoom Out [${keymap.zoomOut.key}]`}
        placement="left"
        openDelay={300}
      >
        <IconButton
          icon={<ZoomOutIcon fontSize="lg" />}
          backgroundColor={mode("white", "gray.800")}
          aria-label="Zoom out"
          pointerEvents="initial"
          isDisabled={!canZoomOut}
          onClick={() => {
            zoomByDelta(-zoomFactor);
          }}
        />
      </Tooltip>
    </>
  );
};
