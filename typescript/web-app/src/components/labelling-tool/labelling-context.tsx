import { createContext } from "react";
import { View as OlView } from "ol";

export const LabellingContext = createContext({
  zoomByDelta: (ratio: number) => {},
  setView: (view: OlView) => {},
});
