import React, { RefObject } from "react";
import {
  IconButton,
  chakra,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";

import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";

import { useLabellingStore } from "../../../connectors/labelling-state";
import { FullScreenTool } from "./full-screen-tool";

const ZoomOutIcon = chakra(RiZoomOutLine);
const ZoomInIcon = chakra(RiZoomInLine);

export const ZoomToolbar = ({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement>;
}) => {
  const canZoomIn = useLabellingStore((state) => state.canZoomIn);
  const canZoomOut = useLabellingStore((state) => state.canZoomOut);
  const zoomByDelta = useLabellingStore((state) => state.zoomByDelta);
  const zoomFactor = useLabellingStore((state) => state.zoomFactor);

  return (
    <>
      <FullScreenTool containerRef={containerRef} />
      <Tooltip label="Zoom In" placement="left" openDelay={300}>
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
      <Tooltip label="Zoom Out" placement="left" openDelay={300}>
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
