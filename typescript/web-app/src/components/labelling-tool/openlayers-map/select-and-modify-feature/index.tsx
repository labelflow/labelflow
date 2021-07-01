import { useEffect, useState, useCallback, MutableRefObject } from "react";
import { Feature, Map as OlMap } from "ol";
import { Geometry } from "ol/geom";
import { Vector as OlSourceVector } from "ol/source";
import { ResizeInteraction } from "./resize-interaction";
import { SelectInteraction } from "./select-interaction";
import { TranslateFeature } from "./translate-interaction";
import { useLabellingStore } from "../../../../connectors/labelling-state";

export const SelectAndModifyFeature = (props: {
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
  map: OlMap | null;
}) => {
  const { sourceVectorLabelsRef, map } = props;
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Geometry> | null>(null);
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);

  const getSelectedFeature = useCallback(() => {
    if (selectedFeature?.getProperties()?.id !== selectedLabelId) {
      if (selectedLabelId == null) {
        setSelectedFeature(null);
      } else {
        const featureFromSource = sourceVectorLabelsRef.current
          ?.getFeatures()
          ?.filter(
            (feature) => feature.getProperties().id === selectedLabelId
          )?.[0];
        if (featureFromSource != null) {
          setSelectedFeature(featureFromSource);
        }
      }
    }
  }, [selectedLabelId, sourceVectorLabelsRef.current]);

  useEffect(() => {
    sourceVectorLabelsRef.current?.on("addfeature", getSelectedFeature);
    return () =>
      sourceVectorLabelsRef.current?.un("addfeature", getSelectedFeature);
  }, [sourceVectorLabelsRef.current]);

  useEffect(() => {
    getSelectedFeature();
  }, [selectedLabelId]);
  return (
    <>
      <SelectInteraction {...props} />
      <TranslateFeature selectedFeature={selectedFeature} />
      <ResizeInteraction selectedFeature={selectedFeature} map={map} />
    </>
  );
};
