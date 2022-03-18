import fscreen from "fscreen";
import { isNil } from "lodash/fp";
import {
  createContext,
  CSSProperties,
  MutableRefObject,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type FullScreenState = {
  fullScreen: boolean;
  toggleFullScreen: () => void;
  ref: MutableRefObject<HTMLDivElement | null>;
};

const FullScreenContext = createContext({} as FullScreenState);

export const useFullScreen = () => useContext(FullScreenContext);

const useFullScreenState = (): FullScreenState => {
  const [fullScreen, setFullScreen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onChange = () => {
      const newFullScreen = fscreen.fullscreenElement === ref.current;
      if (fullScreen === newFullScreen) return;
      setFullScreen(newFullScreen);
    };
    fscreen.addEventListener("fullscreenchange", onChange);
    return () => fscreen.removeEventListener("fullscreenchange", onChange);
  });
  const toggleFullScreen = () => {
    if (isNil(ref.current)) return;
    if (!isNil(fscreen.fullscreenElement)) {
      fscreen.exitFullscreen();
    }
    if (fscreen.fullscreenElement !== ref.current) {
      fscreen.requestFullscreen(ref.current);
    }
  };
  return { fullScreen, toggleFullScreen, ref };
};

export type FullScreenProviderProps = PropsWithChildren<{}>;

export const FullScreenProvider = ({ children }: FullScreenProviderProps) => (
  <FullScreenContext.Provider value={useFullScreenState()}>
    {children}
  </FullScreenContext.Provider>
);

export type FullScreenWrapperProps = PropsWithChildren<{}>;

export const FullScreen = ({ children }: FullScreenWrapperProps) => {
  const { fullScreen, ref } = useFullScreen();
  const style: CSSProperties | undefined = fullScreen
    ? { height: "100%", width: "100%" }
    : undefined;
  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};
