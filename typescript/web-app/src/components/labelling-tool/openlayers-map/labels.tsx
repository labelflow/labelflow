import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { fromExtent } from "ol/geom/Polygon";
import { Fill, Stroke, Style } from "ol/style";
import { useHotkeys } from "react-hotkeys-hook";

import { client } from "../../../connectors/apollo-client";
import { keymap } from "../../../keymap";
import { useLabellingStore } from "../../../connectors/labelling-state";
import { useUndoStore, Effect } from "../../../connectors/undo-store";
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

const deleteLabelMutation = gql`
  mutation deleteLabel($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
      x
      y
      width
      height
      imageId
    }
  }
`;

const createLabelWithIdMutation = gql`
  mutation createLabel(
    $id: ID!
    $imageId: ID!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
  ) {
    createLabel(
      data: {
        id: $id
        imageId: $imageId
        x: $x
        y: $y
        width: $width
        height: $height
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
  }: { setSelectedLabelId: (labelId: string | null) => void }
): Effect => ({
  do: async (labelId = id) => {
    const { data } = await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id: labelId },
      refetchQueries: ["getImageLabels"],
    });
    setSelectedLabelId(null);
    return data?.deleteLabel;
  },
  undo: async (deletedLabel) => {
    /* It is important to use the same id for the re-creation when the label
     * was created in the current session to enable the undoing of the creation effect */
    const { data } = await client.mutate({
      mutation: createLabelWithIdMutation,
      variables: deletedLabel,
      refetchQueries: ["getImageLabels"],
    });

    setSelectedLabelId(data?.createLabel?.id);

    return data?.createLabel?.id;
  },
});

export const Labels = () => {
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  const { perform } = useUndoStore();
  const imageId = useRouter().query?.id;
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
        createDeleteLabelEffect({ id: selectedLabelId }, { setSelectedLabelId })
      );
    },
    {},
    [selectedLabelId, setSelectedLabelId]
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
