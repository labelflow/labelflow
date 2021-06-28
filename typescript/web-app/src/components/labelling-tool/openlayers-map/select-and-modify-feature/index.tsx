import { useState } from "react";
import { SelectInteraction } from "./select-interaction";
import { TranslateFeature } from "./translate-interaction";

export const SelectAndModifyFeature = (props) => {
  const [selectedFeatures, setSelectedFeatures] = useState(null);
  return (
    <>
      <SelectInteraction setSelectedFeatures={setSelectedFeatures} {...props} />
      <TranslateFeature selectedFeatures={selectedFeatures} />
    </>
  );
};
