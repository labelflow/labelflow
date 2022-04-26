import { ApolloCache } from "@apollo/client";
import { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import {
  GeometryInput,
  LabelType,
} from "../../../../graphql-types/globalTypes";
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

const createLabelMutationUpdateCommon = (
  cache: ApolloCache<unknown>,
  { imageId, id, labelClassId, geometry, type }: CreateLabelInputs
): void => {
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

export const createLabelMutationUpdate = (
  input: CreateLabelInputs
): MutationBaseOptions["update"] => {
  return (cache, { data }) => {
    if (typeof data?.createLabel?.id !== "string") return;
    createLabelMutationUpdateCommon(cache, input);
  };
};

export const createIogLabelMutationUpdate = (
  input: CreateLabelInputs
): MutationBaseOptions["update"] => {
  return (cache, { data }) => {
    if (typeof data?.createIogLabel?.id !== "string") return;
    createLabelMutationUpdateCommon(cache, input);
  };
};
