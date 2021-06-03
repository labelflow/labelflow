import { createBox, DrawEvent } from "ol/interaction/Draw";
import GeometryType from "ol/geom/GeometryType";
import gql from "graphql-tag";
import { useLabellingStore, Tools } from "../../../connectors/labelling-state";
import { useUndoStore, Effect } from "../../../connectors/undo-store";
import { client } from "../../../connectors/apollo-client";

type Props = { imageId: string };

const createLabelMutation = gql`
  mutation createLabel(
    $imageId: ID!
    $x: Float!
    $y: Float!
    $width: Int!
    $height: Int!
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
    });
  },
  undo: () => console.log(imageId),
});

const geometryFunction = createBox();

export const DrawBoundingBoxInteraction = ({ imageId }: Props) => {
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const { perform } = useUndoStore();

  if (selectedTool !== Tools.BOUNDING_BOX) {
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
            width: Math.floor(destX - x),
            height: Math.floor(destY - y),
          })
        );
        return false;
      }}
    />
  );
};
