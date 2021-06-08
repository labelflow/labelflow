import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { fromExtent } from "ol/geom/Polygon";
import { Fill, Stroke, Style } from "ol/style";

import { useLabellingStore } from "../../../connectors/labelling-state";
import { Label } from "../../../graphql-types.generated";

const getImageLabelsQuery = gql`
  query getImageLabels($imageId: ID!) {
    image(where: { id: $imageId }) {
      labels {
        id
        x
        y
        width
        height
      }
    }
  }
`;

export const Labels = ({ imageId }: { imageId: string }) => {
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const { data } = useQuery(getImageLabelsQuery, {
    variables: { imageId },
    onError: (e) => {
      throw e;
    },
  });

  const labels = data?.image?.labels ?? [];

  return (
    <olLayerVector>
      <olSourceVector>
        {labels.map(({ id, x, y, width, height }: Label) => {
          return (
            <olFeature
              key={id}
              id={id}
              geometry={fromExtent([x, y, x + width, y + height])}
              style={() => {
                const isSelected = id === selectedLabelId;
                return new Style({
                  fill: new Fill({
                    color: `rgba(90, 24, 24, ${isSelected ? "0.4" : "0.1"}`,
                  }),
                  stroke: new Stroke({
                    color: "#E53E3E",
                    width: 2,
                  }),
                  zIndex: isSelected ? 1000 : 1,
                });
              }}
            />
          );
        })}
      </olSourceVector>
    </olLayerVector>
  );
};
