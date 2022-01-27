import { ApolloClient, gql } from "@apollo/client";
import { Coordinate } from "ol/coordinate";

import { Label } from "@labelflow/graphql-types";
import { Effect } from "..";

const UPDATE_LABEL_MUTATION = gql`
  mutation UndoUpdateIogLabelMutation(
    $id: ID!
    $geometry: GeometryInput
    $smartToolInput: JSON
  ) {
    updateLabel(
      where: { id: $id }
      data: { geometry: $geometry, smartToolInput: $smartToolInput }
    ) {
      id
      x
      y
      width
      height
      geometry {
        type
        coordinates
      }
      smartToolInput
    }
  }
`;

const GET_LABEL_QUERY = gql`
  query GetLabelGeometryAndSmartToolQuery($id: ID!) {
    label(where: { id: $id }) {
      id
      x
      y
      width
      height
      geometry {
        type
        coordinates
      }
      smartToolInput
    }
  }
`;

const updateIogLabelMutation = gql`
  mutation UpdateIogLabelMutation(
    $id: ID!
    $x: Float
    $y: Float
    $width: Float
    $height: Float
    $pointsInside: [[Float!]]
    $pointsOutside: [[Float!]]
    $centerPoint: [Float!]
  ) {
    updateIogLabel(
      data: {
        id: $id
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
      geometry {
        type
        coordinates
      }
      smartToolInput
    }
  }
`;

type PartialLabel = Pick<
  Label,
  | "id"
  | "type"
  | "geometry"
  | "labelClass"
  | "smartToolInput"
  | "x"
  | "y"
  | "width"
  | "height"
>;

export const createUpdateIogLabelEffect = (
  {
    labelId,
    x,
    y,
    width,
    height,
    pointsInside,
    pointsOutside,
    centerPoint,
  }: {
    labelId: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    pointsInside?: Coordinate[];
    pointsOutside?: Coordinate[];
    centerPoint?: Coordinate;
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
      label: PartialLabel;
    }>({
      query: GET_LABEL_QUERY,
      variables: { id: labelId },
    });
    if (labelResponse == null) {
      throw new Error(`Missing label with id ${labelId}`);
    }
    const { label: originalLabel } = labelResponse;
    const optimisticResponse = {
      updateIogLabel: {
        ...originalLabel,
        id: labelId,
        smartToolInput: {
          x: x ?? originalLabel?.smartToolInput?.x,
          y: y ?? originalLabel?.smartToolInput?.y,
          width: width ?? originalLabel?.smartToolInput?.width,
          height: height ?? originalLabel?.smartToolInput?.height,
          pointsInside:
            pointsInside ?? originalLabel?.smartToolInput?.pointsInside,
          pointsOutside:
            pointsOutside ?? originalLabel?.smartToolInput?.pointsOutside,
          centerPoint:
            centerPoint ?? originalLabel?.smartToolInput?.centerPoint,
        },
        __typename: "Label",
      },
    };

    await client.mutate({
      mutation: updateIogLabelMutation,
      variables: {
        id: labelId,
        x,
        y,
        width,
        height,
        pointsInside,
        pointsOutside,
        centerPoint,
      },
      optimisticResponse,
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
    await client.mutate({
      mutation: UPDATE_LABEL_MUTATION,
      optimisticResponse: {
        updateLabel: {
          ...originalLabel,
          __typename: "Label",
        },
      },
      variables: {
        id: labelId,
        geometry: {
          type: originalLabel.geometry.type,
          coordinates: originalLabel.geometry.coordinates,
        },
        smartToolInput: originalLabel.smartToolInput,
      },
      // no need to write an update as apollo automatically does it if we query the updated fields.
    });
    return id;
  },
});
