import { useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";

import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

/* We want to ensure we use an up-to-date pixel ratio
 * when we switch from a screen to another one with a different ratio.
 * Currently, the only way to so is to listen to a media query with matchMedia
 *
 * see. https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#monitoring_screen_resolution_or_zoom_level_changes */
let pixelRatio = window.devicePixelRatio;
const updatePixelRatio = () => {
  pixelRatio = window.devicePixelRatio;
  matchMedia(`(resolution: ${pixelRatio}dppx)`).addEventListener(
    "change",
    updatePixelRatio,
    { once: true }
  );
};
updatePixelRatio();

export const CursorGuides = ({
  pointerPositionRef,
  devicePixelRatio = pixelRatio,
}: {
  pointerPositionRef: { current: Array<number> | null };
  devicePixelRatio: number;
}) => {
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const horizontalBarRef = useRef<HTMLDivElement | null>(null);
  const verticalBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const followMouse = () => {
      requestAnimationFrame(followMouse);
      if (!horizontalBarRef.current || !verticalBarRef.current) return;

      if (selectedTool !== Tools.BOUNDING_BOX) {
        horizontalBarRef.current.style.visibility = "hidden";
        verticalBarRef.current.style.visibility = "hidden";
        return;
      }

      if (!pointerPositionRef?.current) return;

      horizontalBarRef.current.style.visibility = "visible";
      verticalBarRef.current.style.visibility = "visible";

      horizontalBarRef.current.style.top = `${
        pointerPositionRef.current[1] / devicePixelRatio
      }px`;
      horizontalBarRef.current.style.left = `calc(-100% + ${
        pointerPositionRef.current[0] / devicePixelRatio
      }px)`;

      verticalBarRef.current.style.top = `calc(-100% + ${
        pointerPositionRef.current[1] / devicePixelRatio
      }px)`;
      verticalBarRef.current.style.left = `${
        pointerPositionRef.current[0] / devicePixelRatio
      }px`;
    };
    followMouse();
  }, [selectedTool]);

  const guideColor = "#05FF00";

  return (
    <>
      <Box
        ref={horizontalBarRef}
        bg={guideColor}
        w="200%"
        h="1px"
        position="absolute"
        pointerEvents="none"
        zIndex={2}
      />
      <Box
        ref={verticalBarRef}
        bg={guideColor}
        w="1px"
        h="200%"
        position="absolute"
        pointerEvents="none"
        zIndex={2}
      />
    </>
  );
};
