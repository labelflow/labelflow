import { useQuery } from "@apollo/client";
import { useTheme } from "@chakra-ui/react";
import { Feature } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import { Geometry, MultiPoint } from "ol/geom";
import Polygon from "ol/geom/Polygon";
import { Vector as OlSourceVector } from "ol/source";
import { Fill, Stroke, Style, Text } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { MutableRefObject } from "react";
import {
  extractIogMaskFromLabel,
  getIogMaskIdFromLabelId,
  iogMaskColor,
} from "../../../connectors/iog";
import {
  SelectionToolState,
  Tools,
  useLabelingStore,
} from "../../../connectors/labeling-state";
import {
  GetImageLabelsQuery,
  GetImageLabelsQueryVariables,
} from "../../../graphql-types/GetImageLabelsQuery";
import { LabelType } from "../../../graphql-types/globalTypes";
import { useDatasetImage } from "../../../hooks";
import { noneClassColor } from "../../../theme";
import { GET_IMAGE_LABELS_QUERY } from "./queries";

const useLabelTextFont = () => {
  const theme = useTheme();
  const fontFamily = theme.fonts?.body ?? "Arial, Helvetica, Sans-Serif";
  const fontSize = theme.fontSizes?.md ?? "1rem";
  return `normal ${fontSize} ${fontFamily}`;
};

const getLabelText = (text: string, color: string, font: string) =>
  new Text({
    text,
    font,
    textBaseline: "middle",
    overflow: true,
    placement: "point",
    fill: new Fill({ color: "white" }),
    stroke: new Stroke({ color, width: 5 }),
  });

export const Labels = ({
  sourceVectorLabelsRef,
}: {
  sourceVectorLabelsRef?: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const { id: imageId } = useDatasetImage();
  const { data, previousData } = useQuery<
    GetImageLabelsQuery,
    GetImageLabelsQueryVariables
  >(GET_IMAGE_LABELS_QUERY, {
    skip: !imageId,
    variables: { imageId: imageId as string },
  });
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const selectedTool = useLabelingStore((state) => state.selectedTool);
  const selectionToolState = useLabelingStore(
    (state) => state.selectionToolState
  );
  const iogProcessingLabels = useLabelingStore(
    (state) => state.iogProcessingLabels
  );
  const showLabelsGeometry = useLabelingStore(
    (state) => state.showLabelsGeometry
  );
  const showLabelsName = useLabelingStore((state) => state.showLabelsName);
  const labels = data?.image?.labels ?? previousData?.image?.labels ?? [];
  const selectedLabel = labels.find(({ id }) => id === selectedLabelId);
  const fontFamily = useLabelTextFont();
  return (
    <>
      <olLayerVector>
        <olSourceVector ref={sourceVectorLabelsRef}>
          {showLabelsGeometry &&
            labels
              .filter(({ type }) =>
                [LabelType.Box, LabelType.Polygon].includes(type)
              )
              .map(({ id, labelClass, geometry }) => {
                const isSelected = id === selectedLabelId;
                const labelClassColor = labelClass?.color ?? noneClassColor;
                const labelStyle = new Style({
                  text: showLabelsName
                    ? getLabelText(
                        labelClass?.name ?? "",
                        labelClassColor,
                        fontFamily
                      )
                    : undefined,
                  fill: new Fill({
                    color: `${labelClassColor}${isSelected ? "40" : "10"}`,
                  }),
                  stroke: new Stroke({
                    color: labelClassColor,
                    width: isSelected ? 4 : 2,
                    ...(id && iogProcessingLabels.has(id)
                      ? { lineDash: [5, 15] }
                      : {}),
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
          {selectedLabel?.smartToolInput &&
            (selectedTool === Tools.IOG ||
              ((selectedTool === Tools.SELECTION ||
                selectedTool === Tools.AI_ASSISTANT) &&
                selectionToolState === SelectionToolState.IOG)) && (
              <olFeature
                key={getIogMaskIdFromLabelId(selectedLabel?.id)}
                id={getIogMaskIdFromLabelId(selectedLabel?.id)}
                properties={{ isSelected: true }}
                geometry={new GeoJSON().readGeometry({
                  coordinates: extractIogMaskFromLabel(
                    selectedLabel,
                    data?.image?.width ?? 0,
                    data?.image?.height ?? 0
                  ),
                  type: "Polygon",
                })}
                style={[
                  new Style({
                    fill: new Fill({
                      color: `${iogMaskColor}B3`,
                    }),
                    zIndex: 2,
                  }),
                ]}
              />
            )}
        </olSourceVector>
      </olLayerVector>
    </>
  );
};
