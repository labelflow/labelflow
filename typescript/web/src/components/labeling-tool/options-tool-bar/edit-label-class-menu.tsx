import { useApolloClient, useQuery } from "@apollo/client";
import { getNextClassColor, LABEL_CLASS_COLOR_PALETTE } from "@labelflow/utils";
import GeoJSON, { GeoJSONPolygon } from "ol/format/GeoJSON";
import { Polygon } from "ol/geom";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Tools, useLabelingStore } from "../../../connectors/labeling-state";
import { useUndoStore } from "../../../connectors/undo-store";
import { createCreateLabelEffect } from "../../../connectors/undo-store/effects/create-label";
import { createCreateLabelClassEffect } from "../../../connectors/undo-store/effects/create-label-class";
import { createCreateLabelClassAndCreateLabelEffect } from "../../../connectors/undo-store/effects/create-label-class-and-create-label";
import { createCreateLabelClassAndUpdateLabelEffect } from "../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createDeleteLabelEffect } from "../../../connectors/undo-store/effects/delete-label";
import { createUpdateLabelClassEffect } from "../../../connectors/undo-store/effects/update-label-class";
import { createUpdateLabelClassOfLabelEffect } from "../../../connectors/undo-store/effects/update-label-class-of-label";
import {
  GetImageLabelsQuery,
  GetImageLabelsQueryVariables,
} from "../../../graphql-types/GetImageLabelsQuery";
import { LabelType } from "../../../graphql-types/globalTypes";
import { useDataset, useWorkspace, useDatasetImage } from "../../../hooks";

import { keymap } from "../../../keymap";
import {
  GET_IMAGE_LABELS_QUERY,
  GET_LABEL_CLASSES_OF_DATASET_QUERY,
  GET_LABEL_QUERY,
  labelClassQuery,
} from "../openlayers-map/queries";
import { ClassAdditionMenu } from "./class-addition-menu";
import { ClassSelectionMenu, LabelClassItem } from "./class-selection-menu";

export const EditLabelClassMenu = () => {
  const { slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();
  const { id: imageId } = useDatasetImage();

  const client = useApolloClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery(GET_LABEL_CLASSES_OF_DATASET_QUERY, {
    variables: { slug: datasetSlug, workspaceSlug },
  });
  const datasetId = data?.dataset.id;
  const { perform } = useUndoStore();
  const labelClasses = data?.dataset.labelClasses ?? [];
  const isContextMenuOpen = useLabelingStore(
    (state) => state.isContextMenuOpen
  );
  const selectedTool = useLabelingStore((state) => state.selectedTool);
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const { data: selectedLabelData } = useQuery(GET_LABEL_QUERY, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });

  const selectedLabelClassId = useLabelingStore(
    (state) => state.selectedLabelClassId
  );
  const setSelectedLabelClassId = useLabelingStore(
    (state) => state.setSelectedLabelClassId
  );
  const setSelectedLabelId = useLabelingStore(
    (state) => state.setSelectedLabelId
  );

  useEffect(() => {
    setSelectedLabelClassId(null);
  }, [datasetSlug]);

  const { data: dataLabelClass } = useQuery(labelClassQuery, {
    variables: { id: selectedLabelClassId },
    skip: selectedLabelClassId == null,
  });

  const isInDrawingMode = [
    Tools.BOX,
    Tools.POLYGON,
    Tools.IOG,
    Tools.CLASSIFICATION,
    Tools.FREEHAND,
  ].includes(selectedTool);
  const selectedLabelClass = isInDrawingMode
    ? dataLabelClass?.labelClass
    : selectedLabelData?.label?.labelClass;

  const handleCreateNewClass = useCallback(
    async (name) => {
      const newClassColor =
        labelClasses.length < 1
          ? LABEL_CLASS_COLOR_PALETTE[0]
          : getNextClassColor(
              labelClasses.map((labelClass: any) => labelClass.color)
            );

      if (!isInDrawingMode) {
        if (!selectedLabelId) {
          throw new Error("No label selected");
        }
        // Update class of an existing label with a new class
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
        return;
      }

      // Change currently select class in the menu to an existing class, don't apply the class to any label
      await perform(
        createCreateLabelClassEffect(
          {
            name,
            color: newClassColor,
            selectedLabelClassIdPrevious: selectedLabelClassId,
            datasetId,
          },
          { client }
        )
      );
    },
    [labelClasses, selectedLabelId, datasetId, selectedTool, workspaceSlug]
  );

  const handleSelectedClassChange = useCallback(
    async (item: LabelClassItem | null) => {
      if (!isInDrawingMode) {
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
        return;
      }
      // Change currently select class in the menu to an existing class, don't apply the class to any label
      await perform(
        createUpdateLabelClassEffect({
          selectedLabelClassId: item?.id ?? null,
          selectedLabelClassIdPrevious: selectedLabelClassId,
        })
      );
    },
    [selectedLabelId, selectedLabelClassId, selectedTool, imageId]
  );

  const displayClassSelectionMenu =
    isInDrawingMode ||
    ((selectedTool === Tools.SELECTION ||
      selectedTool === Tools.AI_ASSISTANT) &&
      selectedLabelId != null);

  useHotkeys(
    "*", // We have to manually check if the input corresponds to a change class key because otherwise on AZERTY keyboards we can't change classes when pressing numbers
    (keyboardEvent) => {
      if (
        keymap.changeClass.key.split(",").includes(keyboardEvent.key) &&
        !isContextMenuOpen
      ) {
        // We do not want to interfere with the right click popover shortcuts if it is opened
        const digit = Number(keyboardEvent.code[5]);
        const indexOfLabelClass = (digit + 9) % 10;
        if (indexOfLabelClass < labelClasses.length) {
          handleSelectedClassChange(labelClasses[indexOfLabelClass]);
          setIsOpen(false);
        }
      }
    },
    {},
    [labelClasses, handleSelectedClassChange, isContextMenuOpen, setIsOpen]
  );

  return (
    <>
      {displayClassSelectionMenu && selectedTool !== Tools.CLASSIFICATION && (
        <ClassSelectionMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedLabelClass={selectedLabelClass}
          labelClasses={labelClasses}
          createNewClass={handleCreateNewClass}
          onSelectedClassChange={handleSelectedClassChange}
          includeNoneClass={
            selectedLabelData?.label?.type !== LabelType.Classification
          }
          isContextMenuOpen={isContextMenuOpen}
        />
      )}
      {displayClassSelectionMenu && selectedTool === Tools.CLASSIFICATION && (
        <ClassAdditionMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedLabelClass={selectedLabelClass}
          labelClasses={labelClasses}
          createNewClass={handleCreateNewClass}
          onSelectedClassChange={handleSelectedClassChange}
          isContextMenuOpen={isContextMenuOpen}
        />
      )}
    </>
  );
};
