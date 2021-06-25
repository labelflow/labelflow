import { useMemo } from "react";
import { useRouter } from "next/router";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import { Fill, Stroke, Style } from "ol/style";
import GeometryType from "ol/geom/GeometryType";
import {
  ApolloCache,
  ApolloClient,
  useApolloClient,
  useQuery,
} from "@apollo/client";
import gql from "graphql-tag";

import {
  useLabellingStore,
  Tools,
  BoxDrawingToolState,
} from "../../../connectors/labelling-state";
import { useUndoStore, Effect } from "../../../connectors/undo-store";
import { noneClassColor } from "../../../utils/class-color-generator";

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

type CreateLabelInputs = {
  imageId: string;
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  labelClassId: string | null;
};

const createdLabelFragment = gql`
  fragment NewLabel on Label {
    id
    x
    y
    width
    height
    labelClass {
      id
    }
  }
`;

function addLabelToImageInCache(
  cache: ApolloCache<{
    createLabel: {
      id: string;
      __typename: string;
    };
  }>,
  {
    imageId,
    id,
    x,
    y,
    width,
    height,
    labelClassId,
  }: CreateLabelInputs & { id: string }
) {
  const createdLabel = {
    id,
    x,
    y,
    width,
    height,
    labelClass:
      labelClassId != null
        ? {
            id: labelClassId,
            __typename: "LabelClass",
          }
        : null,
    __typename: "Label",
  };

  cache.modify({
    id: cache.identify({ id: imageId, __typename: "Image" }),
    fields: {
      labels: (existingLabelsRefs) => {
        const newLabelRef = cache.writeFragment({
          data: createdLabel,
          fragment: createdLabelFragment,
        });

        return [...existingLabelsRefs, newLabelRef];
      },
    },
  });
}

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
    const createLabelInputs = {
      x,
      y,
      width,
      height,
      imageId,
      labelClassId: selectedLabelClassId,
    };

    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update(cache, { data: mutationPayloadData }) {
        const id = mutationPayloadData?.createLabel?.id;
        if (typeof id !== "string") {
          return;
        }

        addLabelToImageInCache(cache, { ...createLabelInputs, id });
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);
    return data.createLabel.id;
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
    const createLabelInputs = {
      id,
      x,
      y,
      width,
      height,
      imageId,
      labelClassId: selectedLabelClassId,
    };
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update(cache) {
        addLabelToImageInCache(cache, createLabelInputs);
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);
    return data.createLabel.id;
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
  const selectedLabelClassId = useLabellingStore(
    (state) => state.selectedLabelClassId
  );
  const { data: dataLabelClass } = useQuery(labelClassQuery, {
    variables: { id: selectedLabelClassId },
    skip: selectedLabelClassId == null,
  });
  const { perform } = useUndoStore();

  const selectedLabelClass = dataLabelClass?.labelClass;

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
              selectedLabelClassId,
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
