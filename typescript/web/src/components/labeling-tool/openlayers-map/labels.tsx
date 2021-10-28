import { MutableRefObject } from "react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";

import { Vector as OlSourceVector } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Geometry, MultiPoint } from "ol/geom";
import Polygon from "ol/geom/Polygon";
import { Fill, Stroke, Style } from "ol/style";

import CircleStyle from "ol/style/Circle";
import { Feature } from "ol";
import { Label, LabelType } from "@labelflow/graphql-types";

import { Tools, useLabelingStore } from "../../../connectors/labeling-state";

import { noneClassColor } from "../../../utils/class-color-generator";

const getImageLabelsQuery = gql`
  query getImageLabels($imageId: ID!) {
    image(where: { id: $imageId }) {
      id
      width
      height
      labels {
        type
        id
        x
        y
        width
        height
        smartToolInput
        labelClass {
          id
          name
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

export const Labels = ({
  sourceVectorLabelsRef,
}: {
  sourceVectorLabelsRef?: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const { imageId } = useRouter()?.query;
  const { data, previousData } = useQuery(getImageLabelsQuery, {
    skip: !imageId,
    variables: { imageId: imageId as string },
  });
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const selectedTool = useLabelingStore((state) => state.selectedTool);
  const labels = data?.image?.labels ?? previousData?.image?.labels ?? [];
  const selectedLabel = labels.filter(
    ({ id }: Label) => id === selectedLabelId
  )?.[0];
  // console.log(`selectedLabel = ${JSON.stringify(selectedLabel, null, 1)}`);

  return (
    <>
      <olLayerVector>
        <olSourceVector ref={sourceVectorLabelsRef}>
          {labels
            .filter(
              ({ type, id, smartToolInput }: Label) =>
                [LabelType.Box, LabelType.Polygon].includes(type) //&&
                // !(
                //   id === selectedLabelId &&
                //   smartToolInput &&
                //   selectedTool === Tools.IOG
                // )
            )
            .map(({ id, labelClass, geometry }: Label) => {
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
          {selectedLabel?.smartToolInput && selectedTool === Tools.IOG && (
            <olFeature
              key={`${selectedLabel?.id}-iog-canvas`}
              id={`${selectedLabel?.id}-iog-canvas`}
              properties={{ isSelected: true }}
              geometry={new GeoJSON().readGeometry({
                coordinates: [
                  [
                    [0, 0],
                    [data?.image?.width, 0],
                    [data?.image?.width, data?.image?.height],
                    [0, data?.image?.height],
                    [0, 0],
                  ],
                  [
                    [
                      selectedLabel?.smartToolInput?.x,
                      selectedLabel?.smartToolInput?.y,
                    ],
                    [
                      selectedLabel?.smartToolInput?.x +
                        selectedLabel?.smartToolInput?.width,
                      selectedLabel?.smartToolInput?.y,
                    ],
                    [
                      selectedLabel?.smartToolInput?.x +
                        selectedLabel?.smartToolInput?.width,
                      selectedLabel?.smartToolInput?.y +
                        selectedLabel?.smartToolInput?.height,
                    ],
                    [
                      selectedLabel?.smartToolInput?.x,
                      selectedLabel?.smartToolInput?.y +
                        selectedLabel?.smartToolInput?.height,
                    ],
                    [
                      selectedLabel?.smartToolInput?.x,
                      selectedLabel?.smartToolInput?.y,
                    ],
                  ],
                ],
                type: "Polygon",
              })}
              style={
                new Style({
                  fill: new Fill({
                    color: "#E2E8F0bb",
                  }),
                  stroke: new Stroke({
                    color: "#E2E8F0FF",
                    width: 2,
                  }),
                  zIndex: 2,
                })
              }
            />
          )}
        </olSourceVector>
      </olLayerVector>
    </>
  );
};
