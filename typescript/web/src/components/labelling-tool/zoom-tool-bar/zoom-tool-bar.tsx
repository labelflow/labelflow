import { IconButton, chakra } from "@chakra-ui/react";
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";

import { useLabellingStore } from "../../../connectors/labelling-state";

const ZoomOutIcon = chakra(RiZoomOutLine);
const ZoomInIcon = chakra(RiZoomInLine);

export const ZoomToolbar = () => {
  const canZoomIn = useLabellingStore((state) => state.canZoomIn);
  const canZoomOut = useLabellingStore((state) => state.canZoomOut);
  const zoomByDelta = useLabellingStore((state) => state.zoomByDelta);
  const zoomFactor = useLabellingStore((state) => state.zoomFactor);

  return (
    <>
      <IconButton
        icon={<ZoomInIcon fontSize="lg" />}
        backgroundColor="white"
        aria-label="Zoom in"
        pointerEvents="initial"
        isDisabled={!canZoomIn}
        onClick={() => {
          zoomByDelta(zoomFactor);
        }}
      />
      <IconButton
        icon={<ZoomOutIcon fontSize="lg" />}
        backgroundColor="white"
        aria-label="Zoom out"
        pointerEvents="initial"
        isDisabled={!canZoomOut}
        onClick={() => {
          zoomByDelta(-zoomFactor);
        }}
      />
    </>
  );
};
