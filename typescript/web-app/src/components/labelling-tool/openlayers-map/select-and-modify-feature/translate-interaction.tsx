import { Collection, Feature } from "ol";
import { Geometry } from "ol/geom";

export const TranslateFeature = ({
  selectedFeatures,
}: {
  selectedFeatures: Collection<Feature<Geometry>>;
}) => {
  return <olInteractionTranslate args={{ features: selectedFeatures }} />;
};
