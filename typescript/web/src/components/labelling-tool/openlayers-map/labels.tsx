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

import { useLabellingStore } from "../../../connectors/labelling-state";

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
  const { data } = useQuery(getImageLabelsQuery, {
    skip: !imageId,
    variables: { imageId: imageId as string },
  });
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const labels = data?.image?.labels ?? [];

  return (
    <>
      <olLayerVector>
        <olSourceVector ref={sourceVectorLabelsRef}>
          {labels
            .filter(({ type }: Label) =>
              [LabelType.Box, LabelType.Polygon].includes(type)
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
        </olSourceVector>
      </olLayerVector>
    </>
  );
};
