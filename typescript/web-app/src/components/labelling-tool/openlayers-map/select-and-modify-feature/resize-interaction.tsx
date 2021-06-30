import { useEffect } from "react";
import { Map as OlMap, Feature, MapBrowserEvent } from "ol";

export const resizeInteraction = ({
  feature,
  map,
}: {
  feature: Feature<Geometry> | null;
  map: OlMap | null;
}) => {
  useEffect(() => {
    let previousPosition: Array<number> = [];
    if (!map) return;
    const onPointerMove = (e: MapBrowserEvent) => {
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
  }, [map, feature]);
  return null;
};
