import { ApolloClient, useApolloClient } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import gql from "graphql-tag";
import { Collection, Feature } from "ol";
import { Geometry } from "ol/geom";
import { TranslateEvent } from "ol/interaction/Translate";
import { MutableRefObject, useEffect, useState } from "react";
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

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
const timeout = 1000; // ms

const getSelectedFeature = (
  layerRef: MutableRefObject<OlSourceVector<Geometry> | null>,
  selectedLabelId: string
): Feature<Geometry> | undefined =>
  layerRef.current
    ?.getFeatures()
    ?.filter((feature) => feature.getProperties().id === selectedLabelId)?.[0];

export const TranslateFeature = ({
  //   selectedFeatures,
  sourceVectorLabelsRef,
}: {
  //   selectedFeatures: Collection<Feature<Geometry>> | null;
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const [selectedFeatures, setSelectedFeatures] =
    useState<Collection<Feature<Geometry>> | null>(null);
  const client = useApolloClient();
  const { perform } = useUndoStore();
  const toast = useToast();
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);

  useEffect(() => {
    const getSelectedLabelInOpenLayers = async () => {
      if (selectedLabelId == null) {
        setSelectedFeatures(null);
      } else if (sourceVectorLabelsRef.current != null) {
        if (
          getSelectedFeature(sourceVectorLabelsRef, selectedLabelId) == null
        ) {
          // TODO: find a way to do this without a while, maybe keeping track of the labels added to open layers?
          // We need this to wait for the labels to be added to open layers on the first render or when they have just been created
          const startDate = Date.now();
          while (
            getSelectedFeature(sourceVectorLabelsRef, selectedLabelId) ==
              null &&
            startDate - Date.now() < timeout
          ) {
            // eslint-disable-next-line no-await-in-loop
            await sleep(100);
          }
        }
        const selectedFeature = getSelectedFeature(
          sourceVectorLabelsRef,
          selectedLabelId
        );
        if (selectedFeature != null) {
          setSelectedFeatures(new Collection([selectedFeature]));
        }
      }
    };
    getSelectedLabelInOpenLayers();
  }, [sourceVectorLabelsRef.current, selectedLabelId]);

  return selectedFeatures != null ? (
    <olInteractionTranslate
      args={{ features: selectedFeatures }}
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
