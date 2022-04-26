import { useApolloClient, useQuery } from "@apollo/client";
import { getNextClassColor, LABEL_CLASS_COLOR_PALETTE } from "@labelflow/utils";
import { isEmpty } from "lodash/fp";
import GeoJSON, { GeoJSONPolygon } from "ol/format/GeoJSON";
import { Polygon } from "ol/geom";
import { forwardRef, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Tools, useLabelingStore } from "../../../connectors/labeling-state";
import { useUndoStore } from "../../../connectors/undo-store";
import { createCreateLabelEffect } from "../../../connectors/undo-store/effects/create-label";
import { createCreateLabelClassAndCreateLabelEffect } from "../../../connectors/undo-store/effects/create-label-class-and-create-label";
import { createCreateLabelClassAndUpdateLabelEffect } from "../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createDeleteLabelEffect } from "../../../connectors/undo-store/effects/delete-label";
import { createUpdateLabelClassOfLabelEffect } from "../../../connectors/undo-store/effects/update-label-class-of-label";
import {
  GetImageLabelsQuery,
  GetImageLabelsQueryVariables,
} from "../../../graphql-types/GetImageLabelsQuery";
import { LabelType } from "../../../graphql-types/globalTypes";
import { useDataset, useDatasetImage, useWorkspace } from "../../../hooks";
import { keymap } from "../../../keymap";
import { ClassSelectionPopover } from "../../class-selection-popover";
import { LabelClassItem } from "../../class-selection-popover/class-selection-popover";
import {
  GET_IMAGE_LABELS_QUERY,
  GET_LABEL_CLASSES_OF_DATASET_QUERY,
  GET_LABEL_QUERY,
} from "./queries";

export const EditLabelClass = forwardRef<
  HTMLDivElement | null,
  {
    isOpen: boolean;
    onClose: () => void;
  }
>(({ isOpen, onClose }, ref) => {
  const { slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();
  const { id: imageId } = useDatasetImage();
  const client = useApolloClient();
  const { data } = useQuery(GET_LABEL_CLASSES_OF_DATASET_QUERY, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: isEmpty(datasetSlug) || isEmpty(workspaceSlug),
  });
  const datasetId = data?.dataset.id;
  const { perform } = useUndoStore();
  const labelClasses = data?.dataset.labelClasses ?? [];
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabelingStore(
    (state) => state.setSelectedLabelId
  );
  const isContextMenuOpen = useLabelingStore(
    (state) => state.isContextMenuOpen
  );
  const selectedTool = useLabelingStore((state) => state.selectedTool);
  const { data: selectedLabelData } = useQuery(GET_LABEL_QUERY, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const selectedLabelClassId = selectedLabelData?.label?.labelClass?.id ?? null;

  const handleCreateNewClass = useCallback(
    async (name) => {
      const newClassColor =
        labelClasses.length < 1
          ? LABEL_CLASS_COLOR_PALETTE[0]
          : getNextClassColor(
              labelClasses.map((labelClass: any) => labelClass.color)
            );
      if (selectedLabelId != null) {
        // Update class of an existing label with a new class
        onClose();
        await perform(
          createCreateLabelClassAndUpdateLabelEffect(
            {
              name,
              color: newClassColor,
              selectedLabelId,
              datasetId,
            },
            { client }
          )
        );
        return;
      }

      if (selectedTool === Tools.CLASSIFICATION && imageId) {
        // Create a new classification label of a new class
        const { data: imageLabelsData } = await client.query({
          query: GET_IMAGE_LABELS_QUERY,
          variables: { imageId },
        });
        const geometry = new GeoJSON().writeGeometryObject(
          new Polygon([
            [
              [0, 0],
              [0, imageLabelsData.image.height],
              [imageLabelsData.image.width, imageLabelsData.image.height],
              [imageLabelsData.image.width, 0],
              [0, 0],
            ],
          ])
        ) as GeoJSONPolygon;
        onClose();
        await perform(
          createCreateLabelClassAndCreateLabelEffect(
            {
              name,
              color: newClassColor,
              datasetId,
              imageId,
              previouslySelectedLabelClassId: selectedLabelClassId,
              geometry,
              labelType: LabelType.Classification,
            },
            {
              setSelectedLabelId,
              client,
            }
          )
        );
      }
    },
    [
      labelClasses,
      datasetId,
      selectedLabelId,
      selectedTool,
      imageId,
      selectedLabelClassId,
      workspaceSlug,
    ]
  );

  const handleSelectedClassChange = useCallback(
    async (item: LabelClassItem | null) => {
      if (selectedLabelId != null) {
        if (selectedLabelData?.label?.type === LabelType.Classification) {
          // Change the class of an existing classification label to an existing class
          const { data: imageLabelsData } = await client.query<
            GetImageLabelsQuery,
            GetImageLabelsQueryVariables
          >({
            query: GET_IMAGE_LABELS_QUERY,
            variables: { imageId },
          });

          const classificationsOfThisClass =
            imageLabelsData.image.labels.filter(
              (label) =>
                label.labelClass?.id === item?.id &&
                label.type === LabelType.Classification
            );
          if (classificationsOfThisClass.length > 0) {
            // If there is already a classification of the same class, delete the current one (to merge them)
            await perform(
              createDeleteLabelEffect(
                { id: selectedLabelId },
                { setSelectedLabelId, client }
              )
            );
            return;
          }
        }

        // Change the class of an existing label to an existing class
        onClose();
        await perform(
          createUpdateLabelClassOfLabelEffect(
            {
              selectedLabelClassId: item?.id ?? null,
              selectedLabelId,
            },
            { client }
          )
        );

        return;
      }

      if (selectedTool === Tools.CLASSIFICATION && imageId) {
        // Add a classification label of an existing class
        const { data: imageLabelsData } = await client.query<
          GetImageLabelsQuery,
          GetImageLabelsQueryVariables
        >({
          query: GET_IMAGE_LABELS_QUERY,
          variables: { imageId },
        });

        const classificationsOfThisClass = imageLabelsData.image.labels.filter(
          (label) =>
            label.labelClass?.id === item?.id &&
            label.type === LabelType.Classification
        );
        if (classificationsOfThisClass.length > 0) {
          // If there is already a classification of the same class, delete it (to toggle the classification label on/off)
          onClose();
          await perform(
            createDeleteLabelEffect(
              { id: classificationsOfThisClass[0].id },
              { setSelectedLabelId, client }
            )
          );
          return;
        }

        const geometry = new GeoJSON().writeGeometryObject(
          new Polygon([
            [
              [0, 0],
              [0, imageLabelsData.image.height],
              [imageLabelsData.image.width, imageLabelsData.image.height],
              [imageLabelsData.image.width, 0],
              [0, 0],
            ],
          ])
        ) as GeoJSONPolygon;
        onClose();
        await perform(
          createCreateLabelEffect(
            {
              imageId,
              selectedLabelClassId: item?.id ?? null,
              geometry,
              labelType: LabelType.Classification,
            },
            {
              setSelectedLabelId,
              client,
            }
          )
        );
      }
    },
    [selectedLabelId, selectedLabelClassId, selectedTool, imageId]
  );

  useHotkeys(
    "*", // We have to manually check if the input corresponds to a change class key because otherwise on AZERTY keyboards we can't change classes when pressing numbers
    (keyboardEvent) => {
      if (
        keymap.changeClass.key.split(",").includes(keyboardEvent.key) &&
        isOpen
      ) {
        // We do not want to interfere with the class menu shortcuts if this modal is closed
        const digit = Number(keyboardEvent.code[5]);
        const indexOfLabelClass = (digit + 9) % 10;
        if (indexOfLabelClass < labelClasses.length) {
          handleSelectedClassChange(labelClasses[indexOfLabelClass]);
        }
      }
    },
    {},
    [labelClasses, isOpen]
  );

  return (
    <div ref={ref}>
      <ClassSelectionPopover
        isOpen={isOpen}
        onClose={onClose}
        includeNoneClass={
          // No None Class when editing Classification Labels
          !(selectedLabelData?.label?.type === LabelType.Classification) &&
          // No None Class when adding Classification Labels
          !(
            selectedTool === Tools.CLASSIFICATION &&
            selectedLabelData?.label == null
          )
        }
        activateShortcuts={isContextMenuOpen}
        trigger={<div style={{ width: 0, height: 0 }} />} // Needed to have the popover displayed preventing overflow
        labelClasses={labelClasses}
        selectedLabelClassId={selectedLabelClassId}
        createNewClass={handleCreateNewClass}
        onSelectedClassChange={handleSelectedClassChange}
      />
    </div>
  );
});
