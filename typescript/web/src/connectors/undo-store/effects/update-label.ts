import { ApolloClient, gql } from "@apollo/client";
import { GeometryInput, Label } from "@labelflow/graphql-types";
import { getBoundedGeometryFromImage } from "@labelflow/common-resolvers";
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
  query getLabelAndGeometry($id: ID!) {
    label(where: { id: $id }) {
      id
      type
      geometry {
        type
        coordinates
      }
      labelClass {
        id
      }
    }
  }
`;

type PartialLabel = Pick<Label, "id" | "type" | "geometry" | "labelClass">;

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
      label: PartialLabel;
    }>({
      query: getLabelQuery,
      variables: { id: labelId },
    });
    if (labelResponse == null) {
      throw new Error(`Missing label with id ${labelId}`);
    }
    const { label: originalLabel } = labelResponse;
    const imageDimensions = {
      width: image.width,
      height: image.height,
    };

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
      optimisticResponse: {
        updateLabel: {
          id: labelId,
          geometry: boundedGeometry.geometry,
          x: boundedGeometry.x,
          y: boundedGeometry.y,
          width: boundedGeometry.width,
          height: boundedGeometry.height,
          labelClass: originalLabel.labelClass,
          type: originalLabel.type,
          __typename: "Label",
        },
      },
      // no need to write an update as apollo automatically does it if we query the updated fields.
    });

    return { id: labelId, originalLabel };
  },
  undo: async ({
    id,
    originalLabel,
  }: {
    id: string;
    originalLabel: PartialLabel;
  }): Promise<string> => {
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

    const boundedGeometry = getBoundedGeometryFromImage(image, geometry);

    await client.mutate({
      mutation: updateLabelMutation,
      optimisticResponse: {
        updateLabel: {
          id,
          geometry: originalLabel.geometry,
          coordinates: originalLabel.geometry.coordinates,
          x: boundedGeometry.x,
          y: boundedGeometry.y,
          width: boundedGeometry.width,
          height: boundedGeometry.height,
          labelClass: originalLabel.labelClass,
          type: originalLabel.type,
          __typename: "Label",
        },
      },
      variables: {
        id: labelId,
        geometry: {
          type: originalLabel.geometry.type,
          coordinates: originalLabel.geometry.coordinates,
        },
      },
      // no need to write an update as apollo automatically does it if we query the updated fields.
    });
    return id;
  },
});
