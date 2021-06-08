import { useRouter } from "next/router";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import GeometryType from "ol/geom/GeometryType";
import gql from "graphql-tag";
import { useLabellingStore, Tools } from "../../../connectors/labelling-state";
import { useUndoStore, Effect } from "../../../connectors/undo-store";
import { client } from "../../../connectors/apollo-client-schema";

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

const createLabelEffect = ({
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
}): Effect => ({
  do: () => {
    client.mutate({
      mutation: createLabelMutation,
      variables: { imageId, x, y, width, height },
      refetchQueries: ["getImageLabels"],
    });
  },
  undo: () => console.log(imageId),
});

const geometryFunction = createBox();

export const DrawBoundingBoxInteraction = () => {
  const imageId = useRouter().query?.id;

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
