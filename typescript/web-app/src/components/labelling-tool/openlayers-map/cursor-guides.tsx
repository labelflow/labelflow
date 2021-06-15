import { useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { noop, isEqual } from "lodash/fp";

import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

export const CursorGuides = ({
  pointerPositionRef,
}: {
  pointerPositionRef: { current: Array<number> | null };
}) => {
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const horizontalBarRef = useRef<HTMLDivElement | null>(null);
  const verticalBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!horizontalBarRef.current || !verticalBarRef.current) return noop;

    if (selectedTool !== Tools.BOUNDING_BOX) {
      horizontalBarRef.current.style.visibility = "hidden";
      verticalBarRef.current.style.visibility = "hidden";
      return noop;
    }

    horizontalBarRef.current.style.visibility = "visible";
    verticalBarRef.current.style.visibility = "visible";

    let requestId: number;
    let previousPosition = pointerPositionRef.current;

    const followMouse = () => {
      requestId = requestAnimationFrame(followMouse);

      if (!pointerPositionRef.current) return;
      if (!horizontalBarRef.current || !verticalBarRef.current) return;
      if (isEqual(previousPosition, pointerPositionRef.current)) return;

      previousPosition = pointerPositionRef.current;

      /*
       * The guides are 2px thick to stick to bouding boxes stroke width.
       * So we have withdraw 1 to follow the bounding box edges.
       */
      horizontalBarRef.current.style.transform = `translateY(${
        pointerPositionRef.current[1] - 1
      }px)`;
      verticalBarRef.current.style.transform = `translateX(${
        pointerPositionRef.current[0] - 1
      }px)`;
    };
    followMouse();

    return () => cancelAnimationFrame(requestId);
  }, [selectedTool]);

  const guideColor = "#05FF00";

  return (
    <>
      <Box
        ref={horizontalBarRef}
        bg={guideColor}
        w="100%"
        h="2px"
        position="absolute"
        pointerEvents="none"
        willChange="transform"
        zIndex={2}
      />
      <Box
        ref={verticalBarRef}
        bg={guideColor}
        w="2px"
        h="100%"
        position="absolute"
        pointerEvents="none"
        willChange="transform"
        zIndex={2}
      />
    </>
  );
};
