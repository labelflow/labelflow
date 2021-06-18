import { useRouter } from "next/router";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import { Fill, Stroke, Style } from "ol/style";
import GeometryType from "ol/geom/GeometryType";
import { ApolloClient, useApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import {
  useLabellingStore,
  Tools,
  BoxDrawingToolState,
} from "../../../connectors/labelling-state";
import { useUndoStore, Effect } from "../../../connectors/undo-store";

const createLabelMutation = gql`
  mutation createLabel(
    $id: ID
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
  undo: async (id: string): Promise<string> => {
    await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["getImageLabels"],
    });

    setSelectedLabelId(null);
    return id;
  },
  redo: async (id: string) => {
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: { id, imageId, x, y, width, height },
      refetchQueries: ["getImageLabels"],
    });

    setSelectedLabelId(data?.createLabel?.id);

    return data?.createLabel?.id;
  },
});

const geometryFunction = createBox();

export const DrawBoundingBoxInteraction = () => {
  const client = useApolloClient();
  const imageId = useRouter().query?.id;

  const selectedTool = useLabellingStore((state) => state.selectedTool);

  const setBoxDrawingToolState = useLabellingStore(
    (state) => state.setBoxDrawingToolState
  );
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  const { perform } = useUndoStore();

  if (selectedTool !== Tools.BOX) {
    return null;
  }
  if (typeof imageId !== "string") {
    return null;
  }

  const color = "#E53E3E";

  const style = new Style({
    fill: new Fill({
      color: `${color}10`,
    }),
    stroke: new Stroke({
      color,
      width: 2,
    }),
  });

  return (
    <olInteractionDraw
      args={{
        type: GeometryType.CIRCLE,
        geometryFunction,
      }}
      style={style}
      onDrawabort={() => {
        setBoxDrawingToolState(BoxDrawingToolState.IDLE);
        return true;
      }}
      onDrawstart={() => {
        setBoxDrawingToolState(BoxDrawingToolState.DRAWING);
        return true;
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
        setBoxDrawingToolState(BoxDrawingToolState.IDLE);
      }}
    />
  );
};
