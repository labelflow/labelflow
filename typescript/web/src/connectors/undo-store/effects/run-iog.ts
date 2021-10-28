import { ApolloClient, gql } from "@apollo/client";
import { GeometryInput, LabelType } from "@labelflow/graphql-types";
import { Effect } from "..";

const runIogMutation = gql`
  mutation runIog(
    $id: ID!
    $imageUrl: String
    $x: Float
    $y: Float
    $width: Float
    $height: Float
    $pointsInside: [[Float!]]
    $pointsOutside: [[Float!]]
    $centerPoint: [Float!]
  ) {
    runIog(
      data: {
        id: $id
        imageUrl: $imageUrl
        x: $x
        y: $y
        width: $width
        height: $height
        pointsInside: $pointsInside
        pointsOutside: $pointsOutside
        centerPoint: $centerPoint
      }
    ) {
      id
    }
  }
`;

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

export const createRunIogEffect = (
  {
    labelId,
    imageUrl,
    x,
    y,
    width,
    height,
    pointsInside,
    pointsOutside,
    centerPoint,
  }: {
    labelId: string;
    imageUrl?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    pointsInside?: [number, number][];
    pointsOutside?: [number, number][];
    centerPoint?: [number, number];
  },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const { cache } = client;
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
    const originalGeometry = label.geometry;

    client.mutate({
      mutation: runIogMutation,
      variables: {
        id: labelId,
        imageUrl,
        x,
        y,
        width,
        height,
        pointsInside,
        pointsOutside,
        centerPoint,
      },
      refetchQueries: ["getImageLabels"],
      // optimisticResponse: {
      //   updateLabel: {
      //     id: labelId,
      //     geometry: boundedGeometry.geometry,
      //     x: boundedGeometry.x,
      //     y: boundedGeometry.y,
      //     width: boundedGeometry.width,
      //     height: boundedGeometry.height,
      //     labelClass: label.labelClass,
      //     type: label.type,
      //     __typename: "Label",
      //   },
      // },
      // update: (apolloCache, { data }) => {
      //   apolloCache.writeQuery({
      //     query: getLabelQuery,
      //     data: data?.runIog,
      //   });
      // },
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
