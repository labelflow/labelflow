import { ApolloCache } from "@apollo/client";
import { getBoundedGeometryFromImage } from "@labelflow/common-resolvers/src/utils/get-bounded-geometry-from-image";
import { GeometryInput } from "@labelflow/graphql-types";
import { imageDimensionsQuery, createdLabelFragment } from "../shared-queries";

type CreateLabelInputs = {
  imageId: string;
  id?: string;
  labelClassId: string | null | undefined;
  geometry: GeometryInput;
};

export function addLabelToImageInCache(
  cache: ApolloCache<{
    createLabel: {
      id: string;
      __typename: string;
    };
  }>,
  { imageId, id, labelClassId, geometry }: CreateLabelInputs & { id: string }
) {
  const imageDimensionsResult = cache.readQuery<{
    image: { width: number; height: number };
  }>({
    query: imageDimensionsQuery,
    variables: { id: imageId },
  });
  if (imageDimensionsResult != null) {
    const { image } = imageDimensionsResult;
    const boundedGeometry = getBoundedGeometryFromImage(
      { width: image.width, height: image.height },
      geometry
    );
    const createdLabel = {
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
      __typename: "Label",
    };
    cache.modify({
      id: cache.identify({ id: imageId, __typename: "Image" }),
      fields: {
        labels: (existingLabelsRefs = []) => {
          const newLabelRef = cache.writeFragment({
            data: createdLabel,
            fragment: createdLabelFragment,
          });

          return [...existingLabelsRefs, newLabelRef];
        },
      },
    });
  } else {
    throw new Error(`The image id ${imageId} doesn't exist.`);
  }
}
