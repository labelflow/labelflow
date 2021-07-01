import { MutableRefObject, useEffect, useState, useCallback } from "react";
import { ApolloClient, useApolloClient } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import gql from "graphql-tag";
import { Collection, Feature } from "ol";
import { Geometry } from "ol/geom";
import { TranslateEvent } from "ol/interaction/Translate";
import { Vector as OlSourceVector } from "ol/source";
import { useLabellingStore } from "../../../../connectors/labelling-state";
import { Effect, useUndoStore } from "../../../../connectors/undo-store";

const updateLabelMutation = gql`
  mutation updateLabel(
    $id: ID!
    $x: Float
    $y: Float
    $width: Float
    $height: Float
    $labelClassId: ID
  ) {
    updateLabel(
      where: { id: $id }
      data: {
        x: $x
        y: $y
        width: $width
        height: $height
        labelClassId: $labelClassId
      }
    ) {
      id
    }
  }
`;

const getLabelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      x
      y
      width
      height
    }
  }
`;

const updateLabelEffect = (
  {
    labelId,
    x,
    y,
    width,
    height,
  }: {
    labelId: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const { data: labelData } = await client.query({
      query: getLabelQuery,
      variables: { id: labelId },
    });
    const originalGeometry = labelData?.label;
    await client.mutate({
      mutation: updateLabelMutation,
      variables: {
        id: labelId,
        x,
        y,
        width,
        height,
      },
      refetchQueries: ["getImageLabels"],
    });

    return { id: labelId, originalGeometry };
  },
  undo: async ({
    id,
    originalGeometry,
  }: {
    id: string;
    originalGeometry: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }): Promise<string> => {
    await client.mutate({
      mutation: updateLabelMutation,
      variables: {
        id: labelId,
        x: originalGeometry.x,
        y: originalGeometry.y,
        width: originalGeometry.width,
        height: originalGeometry.height,
      },
      refetchQueries: ["getImageLabels"],
    });
    return id;
  },
});

export const TranslateFeature = ({
  sourceVectorLabelsRef,
}: {
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Geometry> | null>(null);
  const client = useApolloClient();
  const { perform } = useUndoStore();
  const toast = useToast();
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);

  const getSelectedFeature = useCallback(() => {
    if (selectedFeature?.getProperties()?.id !== selectedLabelId) {
      if (selectedLabelId == null) {
        setSelectedFeature(null);
      } else {
        const featureFromSource = sourceVectorLabelsRef.current
          ?.getFeatures()
          ?.filter(
            (feature) => feature.getProperties().id === selectedLabelId
          )?.[0];
        if (featureFromSource != null) {
          setSelectedFeature(featureFromSource);
        }
      }
    }
  }, [selectedLabelId, sourceVectorLabelsRef.current]);

  useEffect(() => {
    sourceVectorLabelsRef.current?.on("addfeature", getSelectedFeature);
    return () =>
      sourceVectorLabelsRef.current?.un("addfeature", getSelectedFeature);
  }, [sourceVectorLabelsRef.current]);

  useEffect(() => {
    getSelectedFeature();
  }, [selectedLabelId]);

  return selectedFeature != null ? (
    <olInteractionTranslate
      args={{ features: new Collection([selectedFeature]) }}
      onTranslateend={async (event: TranslateEvent) => {
        const feature = event.features.getArray()[0];
        const [x, y, destinationX, destinationY] = feature
          .getGeometry()
          .getExtent();
        const width = destinationX - x;
        const height = destinationY - y;
        const { id: labelId } = feature.getProperties();
        try {
          await perform(
            updateLabelEffect({ labelId, x, y, width, height }, { client })
          );
        } catch (error) {
          toast({
            title: "Error creating bounding box",
            description: error?.message,
            isClosable: true,
            status: "error",
            position: "bottom-right",
            duration: 10000,
          });
        }
      }}
    />
  ) : null;
};
