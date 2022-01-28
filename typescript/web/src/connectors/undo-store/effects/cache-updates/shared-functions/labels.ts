import { ApolloCache, Reference } from "@apollo/client";
import { getBoundedGeometryFromImage } from "@labelflow/common-resolvers/src/utils/get-bounded-geometry-from-image";
import {
  GeometryInput,
  LabelType,
} from "../../../../../graphql-types/globalTypes";
import {
  IMAGE_DIMENSIONS_QUERY,
  CREATED_LABEL_FRAGMENT,
} from "../../shared-queries";

export type CachedLabel = {
  id: string;
  labelClass: {
    id: string;
    __typename: string;
  } | null;
  geometry: GeometryInput;
  x: number;
  y: number;
  width: number;
  height: number;
  smartToolInput: null;
  type: LabelType;
  __typename: string;
};

export function getBoundedLabel(
  cache: ApolloCache<any>,
  imageId: string,
  geometry: GeometryInput,
  id: string,
  labelClassId: string | null | undefined,
  type: LabelType
): CachedLabel {
  const imageDimensionsResult = cache.readQuery<{
    image: { width: number; height: number };
  }>({
    query: IMAGE_DIMENSIONS_QUERY,
    variables: { id: imageId },
  });

  if (imageDimensionsResult == null) {
    throw new Error(`The image id ${imageId} doesn't exist.`);
  }

  const boundedGeometry = getBoundedGeometryFromImage(
    {
      width: imageDimensionsResult.image.width,
      height: imageDimensionsResult.image.height,
    },
    geometry
  );

  return {
    id,
    labelClass:
      labelClassId != null
        ? {
            id: labelClassId,
            __typename: "LabelClass",
          }
        : null,
    geometry: boundedGeometry.geometry,
    x: boundedGeometry.x,
    y: boundedGeometry.y,
    width: boundedGeometry.width,
    height: boundedGeometry.height,
    smartToolInput: null,
    type,
    __typename: "Label",
  };
}

export function addLabelToImageCache(
  cache: ApolloCache<any>,
  imageId: string,
  createdLabel: CachedLabel
) {
  cache.modify({
    id: cache.identify({ id: imageId, __typename: "Image" }),
    fields: {
      labels(existingLabelsRefs: Reference[] = [], { readField }) {
        const newLabelRef = cache.writeFragment({
          data: createdLabel,
          fragment: CREATED_LABEL_FRAGMENT,
        });

        if (
          existingLabelsRefs.find(
            (label) => readField("id", label) === createdLabel.id
          ) !== undefined
        ) {
          return existingLabelsRefs;
        }

        return [...existingLabelsRefs, newLabelRef];
      },
    },
    optimistic: true,
  });
}

export function removeLabelFromImagesCache(
  cache: ApolloCache<any>,
  imageId: string,
  labelId: string
) {
  cache.modify({
    id: cache.identify({ id: imageId, __typename: "Image" }),
    fields: {
      labels: (existingLabelsRefs: Reference[] = [], { readField }) => {
        return existingLabelsRefs.filter(
          (labelRef) => readField("id", labelRef) !== labelId
        );
      },
    },
    optimistic: true,
  });
}

export function incrementLabelCountInLabelClassCache(
  cache: ApolloCache<any>,
  labelClassId: string,
  incrementValue: number = 1
) {
  cache.modify({
    id: cache.identify({ __typename: "LabelClass", id: labelClassId }),
    fields: {
      // Apollo is smart and this is compatible with the optimistic response
      labelsAggregates({ totalCount = 0, ...aggregates } = {}) {
        return {
          ...aggregates,
          totalCount: totalCount + incrementValue,
        };
      },
    },
    optimistic: true,
  });
}

export function decrementLabelCountInLabelClassCache(
  cache: ApolloCache<any>,
  labelClassId: string,
  decrementValue: number = 1
) {
  return incrementLabelCountInLabelClassCache(
    cache,
    labelClassId,
    -decrementValue
  );
}
