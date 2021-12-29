import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import {
  incrementLabelCountInLabelClassCache,
  decrementLabelCountInLabelClassCache,
} from "./shared-functions/labels";

export const updateLabelClassOfLabel = (
  labelClassIdPrevious: string | null
): MutationBaseOptions["update"] => {
  return (cache, { data }) => {
    if (
      typeof data?.updateLabel?.id !== "string" ||
      labelClassIdPrevious === data.updateLabel.labelClass?.id
    ) {
      return;
    }

    // no need to write a full update as apollo automatically does it if we query the labelClass id: we only update aggregates

    if (labelClassIdPrevious) {
      decrementLabelCountInLabelClassCache(cache, labelClassIdPrevious);
    }

    if (typeof data.updateLabel.labelClass?.id === "string") {
      incrementLabelCountInLabelClassCache(
        cache,
        data.updateLabel.labelClass.id
      );
    }
  };
};
