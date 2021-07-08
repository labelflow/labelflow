import { MutableRefObject, useMemo } from "react";
import { Map as OlMap } from "ol";
import { Geometry } from "ol/geom";
import { Vector as OlSourceVector } from "ol/source";
import { extend } from "@labelflow/react-openlayers-fiber";
import { SelectInteraction } from "./select-interaction";
import { useLabellingStore } from "../../../../connectors/labelling-state";
import { ResizeAndTranslateBox } from "./resize-and-translate-box-interaction";

// Extend react-openlayers-catalogue to include resize and translate interaction
extend({
  ResizeAndTranslateBox: { object: ResizeAndTranslateBox, kind: "Interaction" },
});
export const SelectAndModifyFeature = (props: {
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
  map: OlMap | null;
}) => {
  const { sourceVectorLabelsRef, map } = props;
  // const [selectedFeature, setSelectedFeature] =
  //   useState<Feature<Geometry> | null>(null);
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);

  // const getSelectedFeature = useCallback(() => {
  //   if (selectedFeature?.getProperties()?.id !== selectedLabelId) {
  //     if (selectedLabelId == null) {
  //       setSelectedFeature(null);
  //     } else {
  //       const featureFromSource = sourceVectorLabelsRef.current
  //         ?.getFeatures()
  //         ?.filter(
  //           (feature) => feature.getProperties().id === selectedLabelId
  //         )?.[0];
  //       if (featureFromSource != null) {
  //         setSelectedFeature(featureFromSource);
  //       }
  //     }
  //   }
  // }, [selectedLabelId, sourceVectorLabelsRef.current]);

  // useEffect(() => {
  //   sourceVectorLabelsRef.current?.on("addfeature", getSelectedFeature);
  //   return () =>
  //     sourceVectorLabelsRef.current?.un("addfeature", getSelectedFeature);
  // }, [sourceVectorLabelsRef.current]);

  // useEffect(() => {
  //   getSelectedFeature();
  // }, [selectedLabelId]);

  const selectedFeature = useMemo(() => {
    if (selectedLabelId == null) {
      return null;
    }
    const featureFromSource = sourceVectorLabelsRef.current
      ?.getFeatures()
      ?.filter(
        (feature) => feature.getProperties().id === selectedLabelId
      )?.[0];

    return featureFromSource ?? null;
  }, [selectedLabelId, sourceVectorLabelsRef.current]);

  return (
    <>
      <SelectInteraction {...props} />
      <resizeAndTranslateBox args={{ selectedFeature }} />
    </>
  );
};
