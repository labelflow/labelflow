import { useCallback } from "react";
import { gql, useApolloClient, ApolloClient } from "@apollo/client";

import { useHotkeys } from "react-hotkeys-hook";

import { omit } from "lodash/fp";
import {
  chakra,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiDeleteBinLine } from "react-icons/ri";
import { Label } from "@labelflow/graphql-types";

import { useUndoStore, Effect } from "../../../connectors/undo-store";
import { useLabellingStore } from "../../../connectors/labelling-state";

import {
  addLabelToImageInCache,
  removeLabelFromImageCache,
} from "../openlayers-map/draw-bounding-box-and-polygon-interaction/create-label-effect";

import { getDatasetsQuery } from "../../../pages/local/datasets";
import { keymap } from "../../../keymap";

const DeleteIcon = chakra(RiDeleteBinLine);

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
      geometry {
        type
        coordinates
      }
    }
  }
`;

const createLabelWithIdMutation = gql`
  mutation createLabel(
    $id: ID!
    $imageId: ID!
    $labelClassId: ID
    $geometry: GeometryInput!
  ) {
    createLabel(
      data: {
        id: $id
        imageId: $imageId
        labelClassId: $labelClassId
        geometry: $geometry
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
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const { data } = await client.mutate<{
      deleteLabel: Label & { __typename: "Label" };
    }>({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["countLabels", { query: getDatasetsQuery }],
      /* Note that there is no optimistic response here, only a cache update.
       * We could add it but it feels like premature optimization */
      update(cache, { data: updateData }) {
        if (typeof updateData?.deleteLabel?.imageId !== "string") {
          return;
        }
        removeLabelFromImageCache(cache, {
          id,
          imageId: updateData.deleteLabel.imageId,
        });
      },
    });
    setSelectedLabelId(null);
    return data?.deleteLabel;
  },
  undo: async (
    deletedLabel: Pick<
      Label,
      | "id"
      | "x"
      | "y"
      | "width"
      | "height"
      | "imageId"
      | "labelClass"
      | "geometry"
    >
  ) => {
    const { id: labelId, imageId, geometry } = deletedLabel;
    const labelClassId = deletedLabel?.labelClass?.id;

    const createLabelInputs = {
      id: labelId,
      imageId,
      labelClassId,
      geometry: omit(["__typename"], geometry),
    };

    /* It is important to use the same id for the re-creation when the label
     * was created in the current session to enable the undoing of the creation effect */
    const { data } = await client.mutate({
      mutation: createLabelWithIdMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabels", { query: getDatasetsQuery }],
      optimisticResponse: { createLabel: { id: labelId, __typename: "Label" } },
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
  redo: async (labelId: string) => {
    const { data } = await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id: labelId },
      refetchQueries: ["countLabels", { query: getDatasetsQuery }],
      /* Note that there is no optimistic response here, only a cache update.
       * We could add it but it feels like premature optimization */
      update(cache, { data: updateData }) {
        if (typeof updateData?.deleteLabel?.imageId !== "string") {
          return;
        }
        removeLabelFromImageCache(cache, {
          id,
          imageId: updateData.deleteLabel.imageId,
        });
      },
    });

    setSelectedLabelId(null);
    return data?.deleteLabel;
  },
});

export const DeleteLabelButton = () => {
  const client = useApolloClient();
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );

  const { perform } = useUndoStore();

  useHotkeys(
    keymap.deleteLabel.key,
    () => {
      if (!selectedLabelId) {
        return;
      }

      perform(
        createDeleteLabelEffect(
          { id: selectedLabelId },
          { setSelectedLabelId, client }
        )
      );
    },
    {},
    [selectedLabelId, setSelectedLabelId]
  );

  const deleteSelectedLabel = useCallback(() => {
    if (!selectedLabelId) {
      return;
    }

    perform(
      createDeleteLabelEffect(
        { id: selectedLabelId },
        { setSelectedLabelId, client }
      )
    );
  }, [selectedLabelId, setSelectedLabelId]);

  const bg = useColorModeValue("white", "gray.800");

  if (!selectedLabelId) {
    return null;
  }

  return (
    <Tooltip
      label={`Delete selected label [${keymap.deleteLabel.key}]`}
      placement="bottom"
      openDelay={300}
    >
      <IconButton
        icon={<DeleteIcon fontSize="xl" />}
        onClick={deleteSelectedLabel}
        bg={bg}
        pointerEvents="initial"
        aria-label="Delete selected label"
      />
    </Tooltip>
  );
};
