import { useRef, useEffect } from "react";
import { Map as OlMap, MapBrowserEvent } from "ol";
import { Box } from "@chakra-ui/react";

const style = {
  backgroundColor: "#000000",
  borderColor: "#ffffff",
  borderWidth: "1px",
};

export const CursorGuides = ({ map }: { map: OlMap | null }) => {
  const horizontalBarRef = useRef<HTMLDivElement | null>(null);
  const verticalBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let previousPosition: Array<number> = [];
    if (!map) return;
    const onPointerMove = (e: MapBrowserEvent<UIEvent>) => {
      if (!horizontalBarRef.current || !verticalBarRef.current) return;
      if (
        previousPosition[0] === e.pixel[0] &&
        previousPosition[1] === e.pixel[1]
      )
        return;

      previousPosition = e.pixel;

      /*
       * The guides are 2px thick to stick to bouding boxes stroke width.
       * So we have withdraw 1 to follow the bounding box edges.
       */
      horizontalBarRef.current.style.transform = `translateY(${
        e.pixel[1] - 1.5
      }px)`;
      verticalBarRef.current.style.transform = `translateX(${
        e.pixel[0] - 1.5
      }px)`;
    };
    map.on("pointermove", onPointerMove);
    /* eslint-disable-next-line consistent-return */
    return () => map.un("pointermove", onPointerMove);
  }, [map]);

  return (
    <>
      <Box
        ref={horizontalBarRef}
        w="100%"
        h="3px"
        position="absolute"
        pointerEvents="none"
        willChange="transform"
        style={style}
      />
      <Box
        ref={verticalBarRef}
        w="3px"
        h="100%"
        position="absolute"
        pointerEvents="none"
        willChange="transform"
        style={style}
      />
    </>
  );
};
