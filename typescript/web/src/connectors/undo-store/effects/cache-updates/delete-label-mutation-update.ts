import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import {
  removeLabelFromImagesCache,
  decrementLabelCountInLabelClassCache,
} from "./shared-functions/labels";

export const deleteLabelMutationUpdate = (
  deletedLabelParams: {
    id: string;
    imageId: string;
    labelClassId: string | null | undefined;
  } | null = null
): MutationBaseOptions["update"] => {
  return (cache, { data }) => {
    const { id, imageId, labelClassId } = deletedLabelParams || {
      id: data.deleteLabel.id as string,
      imageId: data.deleteLabel.imageId as string,
      labelClassId: data.deleteLabel.labelClass?.id as string,
    };

    removeLabelFromImagesCache(cache, imageId, id);
    if (labelClassId) {
      decrementLabelCountInLabelClassCache(cache, labelClassId);
    }
  };
};
