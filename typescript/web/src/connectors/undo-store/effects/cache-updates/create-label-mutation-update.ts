import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import { GeometryInput, LabelType } from "@labelflow/graphql-types";
import {
  getBoundedLabel,
  addLabelToImageCache,
  incrementLabelCountInLabelClassCache,
} from "./shared-functions/labels";

type CreateLabelInputs = {
  imageId: string;
  id: string;
  labelClassId: string | null | undefined;
  geometry: GeometryInput;
  type: LabelType;
};

export const createLabelMutationUpdate: ({
  imageId,
  id,
  labelClassId,
  geometry,
  type,
}: CreateLabelInputs) => MutationBaseOptions["update"] =
  ({ imageId, id, labelClassId, geometry, type }: CreateLabelInputs) =>
  (cache, { data }) => {
    if (typeof data?.createLabel?.id !== "string") {
      return;
    }

    const createdLabel = getBoundedLabel(
      cache,
      imageId,
      geometry,
      id,
      labelClassId,
      type
    );

    addLabelToImageCache(cache, imageId, createdLabel);

    if (labelClassId) {
      incrementLabelCountInLabelClassCache(cache, labelClassId);
    }
  };
