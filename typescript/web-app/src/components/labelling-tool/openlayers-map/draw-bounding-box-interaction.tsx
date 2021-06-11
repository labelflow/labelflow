import { useRouter } from "next/router";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import GeometryType from "ol/geom/GeometryType";
import { ApolloClient, useApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { useLabellingStore, Tools } from "../../../connectors/labelling-state";
import { useUndoStore, Effect } from "../../../connectors/undo-store";

const createLabelMutation = gql`
  mutation createLabel(
    $imageId: ID!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
  ) {
    createLabel(
      data: { imageId: $imageId, x: $x, y: $y, width: $width, height: $height }
    ) {
      id
    }
  }
`;

const deleteLabelMutation = gql`
  mutation deleteLabel($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
    }
  }
`;

const createLabelEffect = (
  {
    imageId,
    x,
    y,
    width,
    height,
  }: {
    imageId: string;
    x: number;
    y: number;
    width: number;
    height: number;
  },
  {
    setSelectedLabelId,
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: { imageId, x, y, width, height },
      refetchQueries: ["getImageLabels"],
    });

    setSelectedLabelId(data?.createLabel?.id);

    return data?.createLabel?.id;
  },
  undo: async (id: string): Promise<void> => {
    await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["getImageLabels"],
    });

    setSelectedLabelId(null);
  },
});

const geometryFunction = createBox();

export const DrawBoundingBoxInteraction = () => {
  const client = useApolloClient();
  const imageId = useRouter().query?.id;

  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  const { perform } = useUndoStore();

  if (selectedTool !== Tools.BOUNDING_BOX) {
    return null;
  }
  if (typeof imageId !== "string") {
    return null;
  }

  return (
    <olInteractionDraw
      args={{
        type: GeometryType.CIRCLE,
        geometryFunction,
      }}
      onDrawend={(drawEvent: DrawEvent) => {
        const [x, y, destX, destY] = drawEvent.feature
          .getGeometry()
          .getExtent();

        perform(
          createLabelEffect(
            {
              imageId,
              x,
              y,
              width: destX - x,
              height: destY - y,
            },
            {
              setSelectedLabelId,
              client,
            }
          )
        );
      }}
    />
  );
};
