import React, {
  MutableRefObject,
  useRef,
  useLayoutEffect,
  useState,
  forwardRef,
  useEffect,
} from "react";
import { Map as OlMap } from "ol";
import { isNull, isFunction, isNil } from "lodash/fp";
import { render } from "./renderer";

import { MapProvider } from "./context";

import { ReactOlFiber } from "./types";

const defaultArgs = [{}] as [ConstructorParameters<typeof OlMap>[0]];
const defaultStyle = { width: "100%", height: "640px" };

export type Props = ReactOlFiber.IntrinsicElements["olMap"] & {
  style?: React.CSSProperties;
  containerRef?: React.Ref<HTMLDivElement>;
};

export const Map = forwardRef<OlMap, Props>(
  (
    {
      children,
      args = defaultArgs,
      style = defaultStyle,
      containerRef,
      ...mapProps
    }: Props,
    ref
  ): React.ReactElement => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<OlMap | null>(null);

    useLayoutEffect(() => {
      if (mapContainerRef.current) {
        const wrapped = (
          <olMap
            {...mapProps}
            args={args}
            target={mapContainerRef.current}
            ref={ref}
          >
            {isNull(map) ? null : (
              <MapProvider value={map as OlMap}>{children}</MapProvider>
            )}
          </olMap>
        );
        const returnedMap = render(wrapped, mapContainerRef.current) as OlMap;

        if (isNull(map) && !isNull(returnedMap)) {
          setMap((oldMap) => (isNull(oldMap) ? returnedMap : oldMap));
        }
      }
    }, [children, mapContainerRef.current, map]);

    const setRef = (value: HTMLDivElement): void => {
      if (isNil(value)) {
        return;
      }
      if (isFunction(containerRef)) {
        containerRef(value);
      } else if (!isNil(containerRef)) {
        // eslint-disable-next-line no-param-reassign
        (containerRef as MutableRefObject<HTMLDivElement>).current = value;
      }
      if (isFunction(mapContainerRef)) {
        mapContainerRef(value);
      } else if (!isNil(mapContainerRef)) {
        // eslint-disable-next-line no-param-reassign
        (mapContainerRef as MutableRefObject<HTMLDivElement>).current = value;
      }
    };

    return <div style={style} ref={setRef} />;
  }
);
