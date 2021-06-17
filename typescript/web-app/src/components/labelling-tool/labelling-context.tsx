import { createContext } from "react";
import { View as OlView } from "ol";

type ContextProps = {
  zoomByDelta: (ratio: number) => void;
  setView: (view: OlView) => void;
};

export const LabellingContext = createContext<ContextProps>({
  zoomByDelta: () => {},
  setView: () => {},
});
