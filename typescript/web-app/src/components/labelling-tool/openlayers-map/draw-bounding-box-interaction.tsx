import { useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { Draw as OlDraw } from "ol/interaction";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import { Fill, Stroke, Style } from "ol/style";
import GeometryType from "ol/geom/GeometryType";
import { ApolloClient, useApolloClient, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useToast } from "@chakra-ui/react";

import { useHotkeys } from "react-hotkeys-hook";
import {
  useLabellingStore,
  Tools,
  BoxDrawingToolState,
} from "../../../connectors/labelling-state";
import { useUndoStore, Effect } from "../../../connectors/undo-store";
import { noneClassColor } from "../../../utils/class-color-generator";
import { keymap } from "../../../keymap";

const labelClassQuery = gql`
  query getLabelClass($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
      color
    }
  }
`;
const createLabelMutation = gql`
  mutation createLabel(
    $id: ID
    $imageId: ID!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
    $labelClassId: ID
  ) {
    createLabel(
      data: {
        id: $id
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
    selectedLabelClassId,
  }: {
    imageId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    selectedLabelClassId: string | null;
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
      variables: {
        imageId,
        x,
        y,
        width,
        height,
        labelClassId: selectedLabelClassId,
      },
      refetchQueries: ["getImageLabels", "countLabels"],
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
      variables: {
        id,
        imageId,
        x,
        y,
        width,
        height,
        labelClassId: selectedLabelClassId,
      },
      refetchQueries: ["getImageLabels"],
    });

    setSelectedLabelId(data?.createLabel?.id);

    return data?.createLabel?.id;
  },
});

const geometryFunction = createBox();

export const DrawBoundingBoxInteraction = () => {
  const drawRef = useRef<OlDraw>(null);
  const client = useApolloClient();
  const imageId = useRouter().query?.id;

  const selectedTool = useLabellingStore((state) => state.selectedTool);

  const setBoxDrawingToolState = useLabellingStore(
    (state) => state.setBoxDrawingToolState
  );
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  const selectedLabelClassId = useLabellingStore(
    (state) => state.selectedLabelClassId
  );
  const { data: dataLabelClass } = useQuery(labelClassQuery, {
    variables: { id: selectedLabelClassId },
    skip: selectedLabelClassId == null,
  });
  const { perform } = useUndoStore();

  const selectedLabelClass = dataLabelClass?.labelClass;

  useHotkeys(
    keymap.cancelAction.key,
    () => drawRef.current?.abortDrawing(),
    {},
    [drawRef]
  );

  const toast = useToast();

  const style = useMemo(() => {
    const color = selectedLabelClass?.color ?? noneClassColor;

    return new Style({
      fill: new Fill({
        color: `${color}10`,
      }),
      stroke: new Stroke({
        color,
        width: 2,
      }),
    });
  }, [selectedLabelClass?.color]);

  if (selectedTool !== Tools.BOX) {
    return null;
  }
  if (typeof imageId !== "string") {
    return null;
  }

  return (
    <olInteractionDraw
      ref={drawRef}
      args={{
        type: GeometryType.CIRCLE,
        geometryFunction,
        style, // Needed here to trigger the rerender of the component when the selected class changes
      }}
      onDrawabort={() => {
        setBoxDrawingToolState(BoxDrawingToolState.IDLE);
        return true;
      }}
      onDrawstart={() => {
        setBoxDrawingToolState(BoxDrawingToolState.DRAWING);
        return true;
      }}
      onDrawend={async (drawEvent: DrawEvent) => {
        const [x, y, destX, destY] = drawEvent.feature
          .getGeometry()
          .getExtent();
        const createLabelPromise = perform(
          createLabelEffect(
            {
              imageId,
              x,
              y,
              width: destX - x,
              height: destY - y,
              selectedLabelClassId,
            },
            {
              setSelectedLabelId,
              client,
            }
          )
        );
        setBoxDrawingToolState(BoxDrawingToolState.IDLE);
        try {
          await createLabelPromise;
        } catch (error) {
          toast({
            title: "Error creating bounding box",
            description: error?.message,
            isClosable: true,
            status: "error",
            position: "bottom-right",
            duration: 10000,
          });
        }
      }}
    />
  );
};
