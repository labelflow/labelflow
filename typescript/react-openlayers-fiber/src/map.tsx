import React, {
  useRef,
  useLayoutEffect,
  useState,
  forwardRef,
  ReactNode,
} from "react";
import { Map as OlMap } from "ol";
import { isNull } from "lodash";
import { render } from "./renderer";

import { MapProvider } from "./context";

import { ReactOlFiber } from "./types";

const defaultArgs = [{}] as [ConstructorParameters<typeof OlMap>[0]];
const defaultStyle = { width: "100%", height: "640px" };

export const Map = forwardRef<ReactNode>(
  (
    {
      children,
      args = defaultArgs,
      style = defaultStyle,
      ...mapProps
    }: ReactOlFiber.IntrinsicElements["olMap"] & {
      style?: React.CSSProperties;
    },
    ref
  ): React.ReactElement => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState(null);

    useLayoutEffect(() => {
      if (containerRef.current) {
        const wrapped = (
          <olMap
            {...mapProps}
            args={args}
            target={containerRef.current}
            ref={ref}
          >
            <MapProvider value={map}>{children}</MapProvider>
          </olMap>
        );
        const returned = render(wrapped, containerRef.current);

        if (isNull(map) && !isNull(returned)) {
          setMap(returned);
        }
      }
    }, [children, containerRef.current, map]);

    return <div style={style} ref={containerRef} />;
  }
);
