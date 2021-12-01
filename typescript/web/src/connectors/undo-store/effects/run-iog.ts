import { v4 as uuidv4 } from "uuid";
import { ApolloClient, gql } from "@apollo/client";
import { Coordinate } from "ol/coordinate";

import { GeometryInput, LabelType } from "@labelflow/graphql-types";
import { Effect } from "..";
import {
  deleteLabelMutation,
  addLabelToImageInCache,
  removeLabelFromImageCache,
} from "./create-label";

const updateIogLabelMutation = gql`
  mutation updateIogLabel(
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
      type
      geometry {
        type
        coordinates
      }
      x
      y
      width
      height
      smartToolInput
      labelClass {
        id
        color
      }
    }
  }
`;

const createIogLabelMutation = gql`
  mutation createIogLabel(
    $imageId: String!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
    $centerPoint: [Float!]!
  ) {
    createIogLabel(
      data: {
        imageId: $imageId
        x: $x
        y: $y
        width: $width
        height: $height
        centerPoint: $centerPoint
      }
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
      smartToolInput
      labelClass {
        id
        color
      }
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
        color
      }
    }
  }
`;

const getLabelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      type
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
      labelClass {
        id
        color
      }
    }
  }
`;

export const createCreateIogLabelEffect = (
  {
    imageId,
    x,
    y,
    width,
    height,
    centerPoint,
  }: {
    imageId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    centerPoint: Coordinate;
  },
  {
    setSelectedLabelId,
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const labelId = `temp-${Date.now()}`;
    const optimisticResponse = {
      createIogLabel: {
        id: labelId,
        geometry: {
          type: LabelType.Polygon,
          coordinates: [
            [
              [x, y],
              [x + width, y],
              [x + width, y + height],
              [x, y + height],
              [x, y],
            ],
          ],
        },
        x,
        y,
        width,
        height,
        smartToolInput: {
          x,
          y,
          width,
          height,
          pointsInside: [],
          pointsOutside: [],
          centerPoint,
        },
        labelClass: null,
        type: LabelType.Polygon,
        __typename: "Label",
      },
    };
    // const { cache } = client;
    // addLabelToImageInCache(
    //   cache,
    //   {
    //     imageId,
    //     id: labelId,
    //     labelClassId: null,
    //     geometry: optimisticResponse.createIogLabel.geometry,
    //   },
    //   optimisticResponse.createIogLabel.smartToolInput
    // );

    const { data } = await client.mutate({
      mutation: createIogLabelMutation,
      variables: {
        imageId,
        x,
        y,
        width,
        height,
        centerPoint,
      },
      refetchQueries: [
        "getImageLabels",
        "countLabels",
        "getDatasets",
        "countLabelsOfDataset",
      ],
      optimisticResponse,
      update: (apolloCache, { data: mutationPayloadData }) => {
        apolloCache.writeQuery({
          query: getLabelQuery,
          data: { label: mutationPayloadData?.createIogLabel },
        });
      },
    });

    if (typeof data?.createIogLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createIogLabel.id);
    return data.createIogLabel.id;
  },
  undo: async (id: string): Promise<string> => {
    await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["countLabels", "getDatasets", "countLabelsOfDataset"],
      optimisticResponse: { deleteLabel: { id, __typename: "Label" } },
      update(cache) {
        removeLabelFromImageCache(cache, { imageId, id });
      },
    });

    setSelectedLabelId(null);
    return id;
  },
  redo: async (id: string) => {
    const optimisticResponse = {
      createIogLabel: {
        id,
        geometry: [
          [
            [x, y],
            [x + width, y],
            [x + width, y + height],
            [x, y + height],
            [x, y],
          ],
        ],
        x,
        y,
        width,
        height,
        smartToolInput: {
          x,
          y,
          width,
          height,
          pointsInside: [],
          pointsOutside: [],
          centerPoint,
        },
        labelClass: null,
        type: LabelType.Polygon,
        __typename: "Label",
      },
    };

    const { data } = await client.mutate({
      mutation: createIogLabelMutation,
      variables: {
        id,
        imageId,
        x,
        y,
        width,
        height,
        centerPoint,
      },
      refetchQueries: [
        "getImageLabels",
        "countLabels",
        "getDatasets",
        "countLabelsOfDataset",
      ],
      optimisticResponse,
      update: (apolloCache, { data: mutationPayloadData }) => {
        apolloCache.writeQuery({
          query: getLabelQuery,
          data: { label: mutationPayloadData?.createIogLabel },
        });
      },
    });

    if (typeof data?.createIogLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createIogLabel.id);
    return data.createIogLabel.id;
  },
});

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
      label: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        geometry: GeometryInput;
        imageId: string;
        labelClass: {
          id: string;
          color: string;
        };
        smartToolInput: any;
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
    const optimisticResponse = {
      runIog: {
        id: labelId,
        geometry: originalGeometry,
        x: label?.x,
        y: label?.y,
        width: label?.width,
        height: label?.height,
        smartToolInput: {
          x: x ?? label?.smartToolInput?.x,
          y: y ?? label?.smartToolInput?.y,
          width: width ?? label?.smartToolInput?.width,
          height: height ?? label?.smartToolInput?.height,
          pointsInside: pointsInside ?? label?.smartToolInput?.pointsInside,
          pointsOutside: pointsOutside ?? label?.smartToolInput?.pointsOutside,
          centerPoint: centerPoint ?? label?.smartToolInput?.centerPoint,
        },
        labelClass: label.labelClass,
        type: label.type,
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
      refetchQueries: ["getImageLabels"],
      optimisticResponse,
      update: (apolloCache, { data }) => {
        apolloCache.writeQuery({
          query: getLabelQuery,
          data: { label: data?.runIog },
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
