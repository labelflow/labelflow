import { createContext } from "react";
import { View as OlView } from "ol";

type ContextProps = {
  zoomByDelta: (ratio: number) => void;
  setView: (view: OlView) => void;
  zoomFactor: number;
};

export const LabellingContext = createContext<ContextProps>({
  zoomByDelta: () => {},
  setView: () => {},
  zoomFactor: 0.5,
});
