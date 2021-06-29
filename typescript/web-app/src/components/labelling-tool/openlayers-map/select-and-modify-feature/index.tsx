import { SelectInteraction } from "./select-interaction";
import { TranslateFeature } from "./translate-interaction";

export const SelectAndModifyFeature = (props) => {
  const { sourceVectorLabelsRef } = props;
  return (
    <>
      <SelectInteraction {...props} />
      <TranslateFeature sourceVectorLabelsRef={sourceVectorLabelsRef} />
    </>
  );
};
