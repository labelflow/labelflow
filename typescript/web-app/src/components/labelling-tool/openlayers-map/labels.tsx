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
        labelClass {
          id
          color
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
    }
  }
`;

const createLabelMutation = gql`
  mutation createLabel(
    $imageId: ID!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
    $labelClassId: ID
  ) {
    createLabel(
      data: {
        imageId: $imageId
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
    const { id: labelId, x, y, width, height, imageId } = deletedLabel;
    const labelClassId = deletedLabel?.labelClass?.id;
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: { id: labelId, x, y, width, height, imageId, labelClassId },
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

  return (
    <>
      <olLayerVector>
        <olSourceVector>
          {labels.map(({ id, x, y, width, height, labelClass }: Label) => {
            const isSelected = id === selectedLabelId;
            const labelClassColor = labelClass?.color ?? "#E2E8F0";
            const style = new Style({
              fill: new Fill({
                color: `${labelClassColor}${isSelected ? "40" : "10"}`,
              }),
              stroke: new Stroke({
                color: labelClassColor,
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
    </>
  );
};
