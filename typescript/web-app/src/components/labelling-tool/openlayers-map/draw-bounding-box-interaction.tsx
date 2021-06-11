import { useRouter } from "next/router";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import GeometryType from "ol/geom/GeometryType";
import gql from "graphql-tag";
import { ApolloClient, useApolloClient } from "@apollo/client";
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

const createLabelEffect = ({
  client,
  imageId,
  x,
  y,
  width,
  height,
}: {
  client: ApolloClient<{}>;
  imageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}): Effect => ({
  do: async () => {
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: { imageId, x, y, width, height },
      refetchQueries: ["getImageLabels"],
    });
    return data?.createLabel?.id;
  },
  undo: async (id: string): Promise<void> => {
    await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["getImageLabels"],
    });
  },
});

const geometryFunction = createBox();

export const DrawBoundingBoxInteraction = () => {
  const imageId = useRouter().query?.id;
  const client = useApolloClient();

  const selectedTool = useLabellingStore((state) => state.selectedTool);
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
          createLabelEffect({
            client,
            imageId,
            x,
            y,
            width: destX - x,
            height: destY - y,
          })
        );
      }}
    />
  );
};
