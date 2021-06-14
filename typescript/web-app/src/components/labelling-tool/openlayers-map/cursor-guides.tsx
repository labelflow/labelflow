import { useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";

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

      horizontalBarRef.current.style.top = `${pointerPositionRef.current[1]}px`;
      horizontalBarRef.current.style.left = `calc(-100% + ${pointerPositionRef.current[0]}px)`;

      verticalBarRef.current.style.top = `calc(-100% + ${pointerPositionRef.current[1]}px)`;
      verticalBarRef.current.style.left = `${pointerPositionRef.current[0]}px`;
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
