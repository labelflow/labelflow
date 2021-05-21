import { createContext, useContext } from "react";
import { Map as OlMap } from "ol";

export const MapContext = createContext<OlMap | null>(null);

export const useMap = () => useContext(MapContext);
export const MapConsumer = MapContext.Consumer;
export const MapProvider = MapContext.Provider;
