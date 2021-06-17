import { useContext } from "react";
import { IconButton, chakra } from "@chakra-ui/react";
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";

import { useLabellingStore } from "../../../connectors/labelling-state";
import { LabellingContext } from "../labelling-context";

const ZoomOutIcon = chakra(RiZoomOutLine);
const ZoomInIcon = chakra(RiZoomInLine);

export const ZoomToolbar = () => {
  const { zoomByDelta, zoomFactor } = useContext(LabellingContext);
  const canZoomIn = useLabellingStore((state) => state.canZoomIn);
  const canZoomOut = useLabellingStore((state) => state.canZoomOut);

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
