import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { fromExtent } from "ol/geom/Polygon";
import { Fill, Stroke, Style } from "ol/style";
import { useHotkeys } from "react-hotkeys-hook";

import { client } from "../../../connectors/apollo-client";
import { keymap } from "../../../keymap";
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

const deleteLabel = gql`
  mutation deleteLabel($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
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

  useHotkeys(
    keymap.deleteLabel.key,
    () => {
      client.mutate({
        mutation: deleteLabel,
        variables: { id: selectedLabelId },
        refetchQueries: ["getImageLabels"],
      });
    },
    {},
    [selectedLabelId]
  );

  const labels = data?.image?.labels ?? [];

  // TODO: Put in PR description question about rrggbbaa hex notation (supported at 92%)
  // Alternative is to use https://github.com/sindresorhus/hex-rgb
  const color = "#E53E3E";

  return (
    <olLayerVector>
      <olSourceVector>
        {labels.map(({ id, x, y, width, height }: Label) => {
          const isSelected = id === selectedLabelId;
          const style = new Style({
            fill: new Fill({
              color: `${color}${isSelected ? "40" : "10"}`,
            }),
            stroke: new Stroke({
              color,
              width: 2,
            }),
            zIndex: isSelected ? 2 : 1,
          });

          return (
            <olFeature
              key={id}
              id={id}
              geometry={fromExtent([x, y, x + width, y + height])}
              style={style}
            />
          );
        })}
      </olSourceVector>
    </olLayerVector>
  );
};
