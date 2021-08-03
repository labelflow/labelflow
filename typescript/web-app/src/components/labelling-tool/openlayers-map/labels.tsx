import { MutableRefObject } from "react";
import { useRouter } from "next/router";
import { ApolloClient, useQuery, useApolloClient, gql } from "@apollo/client";

import { Vector as OlSourceVector } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Geometry, MultiPoint } from "ol/geom";
import Polygon from "ol/geom/Polygon";
import { Fill, Stroke, Style } from "ol/style";
import { useHotkeys } from "react-hotkeys-hook";
import CircleStyle from "ol/style/Circle";
import { Feature } from "ol";
import { Label } from "@labelflow/graphql-types";
import { keymap } from "../../../keymap";
import { useLabellingStore } from "../../../connectors/labelling-state";
import { useUndoStore, Effect } from "../../../connectors/undo-store";
import { noneClassColor } from "../../../utils/class-color-generator";
import {
  addLabelToImageInCache,
  removeLabelFromImageCache,
} from "./draw-bounding-box-and-polygon-interaction/create-label-effect";
import { getProjectsQuery } from "../../../pages/projects";

const getImageLabelsQuery = gql`
  query getImageLabels($imageId: ID!) {
    image(where: { id: $imageId }) {
      id
      labels {
        id
        x
        y
        width
        height
        labelClass {
          id
          color
        }
        geometry {
          type
          coordinates
        }
      }
    }
  }
`;

const deleteLabelMutation = gql`
  mutation deleteLabel($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
      x
      y
      width
      height
      imageId
      labelClass {
        id
      }
      geometry {
        type
        coordinates
      }
    }
  }
`;

const createLabelWithIdMutation = gql`
  mutation createLabel(
    $id: ID!
    $imageId: ID!
    $labelClassId: ID
    $geometry: GeometryInput!
  ) {
    createLabel(
      data: {
        id: $id
        imageId: $imageId
        labelClassId: $labelClassId
        geometry: $geometry
      }
    ) {
      id
    }
  }
`;

const createDeleteLabelEffect = (
  { id }: { id: string },
  {
    setSelectedLabelId,
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const { data } = await client.mutate<{
      deleteLabel: Label & { __typename: "Label" };
    }>({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["countLabels", { query: getProjectsQuery }],
      /* Note that there is no optimistic response here, only a cache update.
       * We could add it but it feels like premature optimization */
      update(cache, { data: updateData }) {
        if (typeof updateData?.deleteLabel?.imageId !== "string") {
          return;
        }
        removeLabelFromImageCache(cache, {
          id,
          imageId: updateData.deleteLabel.imageId,
        });
      },
    });
    setSelectedLabelId(null);
    return data?.deleteLabel;
  },
  undo: async (
    deletedLabel: Pick<
      Label,
      | "id"
      | "x"
      | "y"
      | "width"
      | "height"
      | "imageId"
      | "labelClass"
      | "geometry"
    >
  ) => {
    const { id: labelId, imageId, geometry } = deletedLabel;
    const labelClassId = deletedLabel?.labelClass?.id;

    const createLabelInputs = {
      id: labelId,
      imageId,
      labelClassId,
      geometry,
    };

    /* It is important to use the same id for the re-creation when the label
     * was created in the current session to enable the undoing of the creation effect */
    const { data } = await client.mutate({
      mutation: createLabelWithIdMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabels", { query: getProjectsQuery }],
      optimisticResponse: { createLabel: { id: labelId, __typename: "Label" } },
      update(cache) {
        addLabelToImageInCache(cache, createLabelInputs);
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);
    return data.createLabel.id;
  },
  redo: async (labelId: string) => {
    const { data } = await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id: labelId },
      refetchQueries: ["countLabels", { query: getProjectsQuery }],
      /* Note that there is no optimistic response here, only a cache update.
       * We could add it but it feels like premature optimization */
      update(cache, { data: updateData }) {
        if (typeof updateData?.deleteLabel?.imageId !== "string") {
          return;
        }
        removeLabelFromImageCache(cache, {
          id,
          imageId: updateData.deleteLabel.imageId,
        });
      },
    });

    setSelectedLabelId(null);
    return data?.deleteLabel;
  },
});

export const Labels = ({
  sourceVectorLabelsRef,
}: {
  sourceVectorLabelsRef?: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const client = useApolloClient();
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  const { perform } = useUndoStore();
  const { imageId } = useRouter()?.query;
  const { data } = useQuery(getImageLabelsQuery, {
    skip: typeof imageId !== "string",
    variables: { imageId: imageId as string },
    onError: (e) => {
      throw e;
    },
  });

  useHotkeys(
    keymap.deleteLabel.key,
    () => {
      if (!selectedLabelId) {
        return;
      }

      perform(
        createDeleteLabelEffect(
          { id: selectedLabelId },
          { setSelectedLabelId, client }
        )
      );
    },
    {},
    [selectedLabelId, setSelectedLabelId]
  );

  const labels = data?.image?.labels ?? [];

  return (
    <>
      <olLayerVector>
        <olSourceVector ref={sourceVectorLabelsRef}>
          {labels.map(({ id, labelClass, geometry }: Label) => {
            const isSelected = id === selectedLabelId;
            const labelClassColor = labelClass?.color ?? noneClassColor;
            const labelStyle = new Style({
              fill: new Fill({
                color: `${labelClassColor}${isSelected ? "40" : "10"}`,
              }),
              stroke: new Stroke({
                color: labelClassColor,
                width: isSelected ? 4 : 2,
              }),
              zIndex: isSelected ? 2 : 1,
            });
            const verticesStyle = isSelected
              ? new Style({
                  image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                      color: labelClassColor,
                    }),
                  }),
                  geometry: (feature) => {
                    const coordinates = (feature as Feature<Polygon>)
                      .getGeometry()
                      .getCoordinates()[0];
                    return new MultiPoint(coordinates);
                  },
                  zIndex: isSelected ? 2 : 1,
                })
              : null;
            const style = isSelected
              ? [labelStyle, verticesStyle]
              : [labelStyle];

            return (
              <olFeature
                key={id}
                id={id}
                properties={{ isSelected }}
                geometry={new GeoJSON().readGeometry(geometry)}
                style={style}
              />
            );
          })}
        </olSourceVector>
      </olLayerVector>
    </>
  );
};
