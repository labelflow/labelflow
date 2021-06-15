import { useRef, useEffect } from "react";
import { Map as OlMap, MapBrowserEvent } from "ol";
import { Box } from "@chakra-ui/react";
import { isEqual } from "lodash/fp";

import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

export const CursorGuides = ({ map }: { map: OlMap }) => {
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const horizontalBarRef = useRef<HTMLDivElement | null>(null);
  const verticalBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let previousPosition: Array<number> = [];
    if (!map) return;
    const onPointerMove = (e: MapBrowserEvent) => {
      if (!horizontalBarRef.current || !verticalBarRef.current) return;

      if (selectedTool !== Tools.BOUNDING_BOX) {
        horizontalBarRef.current.style.visibility = "hidden";
        verticalBarRef.current.style.visibility = "hidden";
        return;
      }

      horizontalBarRef.current.style.visibility = "visible";
      verticalBarRef.current.style.visibility = "visible";

      if (!horizontalBarRef.current || !verticalBarRef.current) return;
      if (isEqual(previousPosition, e.pixel)) return;

      previousPosition = e.pixel;

      /*
       * The guides are 2px thick to stick to bouding boxes stroke width.
       * So we have withdraw 1 to follow the bounding box edges.
       */
      horizontalBarRef.current.style.transform = `translateY(${
        e.pixel[1] - 1
      }px)`;
      verticalBarRef.current.style.transform = `translateX(${
        e.pixel[0] - 1
      }px)`;
    };
    map.on("pointermove", onPointerMove);
    /* eslint-disable-next-line consistent-return */
    return () => map.un("pointermove", onPointerMove);
  }, [selectedTool, map]);

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
