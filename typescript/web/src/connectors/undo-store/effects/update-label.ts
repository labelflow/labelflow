import { ApolloClient, gql } from "@apollo/client";
import { GeometryInput, LabelType } from "@labelflow/graphql-types";
import { getBoundedGeometryFromImage } from "@labelflow/common-resolvers/src/utils/get-bounded-geometry-from-image";
import { Effect } from "..";

const updateLabelMutation = gql`
  mutation updateLabel($id: ID!, $geometry: GeometryInput, $labelClassId: ID) {
    updateLabel(
      where: { id: $id }
      data: { geometry: $geometry, labelClassId: $labelClassId }
    ) {
      id
      type
      geometry {
        type
        coordinates
      }
      x
      y
      width
      height
      labelClass {
        id
      }
    }
  }
`;

const imageDimensionsQuery = gql`
  query imageDimensions($id: ID!) {
    image(where: { id: $id }) {
      id
      width
      height
    }
  }
`;

const getLabelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      type
      id
      geometry {
        type
        coordinates
      }
      labelClass {
        id
        color
      }
    }
  }
`;

export const createUpdateLabelEffect = (
  {
    labelId,
    geometry,
    imageId,
  }: {
    labelId: string;
    geometry: GeometryInput;
    imageId?: string;
  },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const { cache } = client;
    const imageResponse = cache.readQuery<{
      image: { width: number; height: number };
    }>({
      query: imageDimensionsQuery,
      variables: { id: imageId },
    });
    if (imageResponse == null) {
      throw new Error(`Missing image with id ${imageId}`);
    }
    const { image } = imageResponse;

    const labelResponse = cache.readQuery<{
      label: {
        id: string;
        geometry: GeometryInput;
        imageId: string;
        labelClass: {
          id: string;
          color: string;
        };
        type: LabelType;
      };
    }>({
      query: getLabelQuery,
      variables: { id: labelId },
    });
    if (labelResponse == null) {
      throw new Error(`Missing label with id ${labelId}`);
    }
    const { label } = labelResponse;
    const imageDimensions = {
      width: image.width,
      height: image.height,
    };
    const originalGeometry = label.geometry;
    const boundedGeometry = getBoundedGeometryFromImage(
      imageDimensions,
      geometry
    );

    client.mutate({
      mutation: updateLabelMutation,
      variables: {
        id: labelId,
        geometry,
      },
      refetchQueries: ["getImageLabels"],
      optimisticResponse: {
        updateLabel: {
          id: labelId,
          geometry: boundedGeometry.geometry,
          x: boundedGeometry.x,
          y: boundedGeometry.y,
          width: boundedGeometry.width,
          height: boundedGeometry.height,
          labelClass: label.labelClass,
          type: label.type,
          __typename: "Label",
        },
      },
      update: (apolloCache, { data }) => {
        apolloCache.writeQuery({
          query: getLabelQuery,
          data: { label: data?.updateLabel },
        });
      },
    });

    return { id: labelId, originalGeometry };
  },
  undo: async ({
    id,
    originalGeometry,
  }: {
    id: string;
    originalGeometry: GeometryInput;
  }): Promise<string> => {
    await client.mutate({
      mutation: updateLabelMutation,
      variables: {
        id: labelId,
        geometry: {
          type: originalGeometry.type,
          coordinates: originalGeometry.coordinates,
        },
      },
      refetchQueries: ["getImageLabels"],
    });
    return id;
  },
});
