import { useState, useEffect, useCallback } from "react";
import { gql, useQuery, useApolloClient } from "@apollo/client";
import { Label, LabelType } from "@labelflow/graphql-types";
import GeoJSON, { GeoJSONPolygon } from "ol/format/GeoJSON";
import { Polygon } from "ol/geom";

import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import { ClassSelectionMenu, LabelClassItem } from "./class-selection-menu";
import { ClassAdditionMenu } from "./class-addition-menu";
import { Tools, useLabelingStore } from "../../../connectors/labeling-state";
import { useUndoStore } from "../../../connectors/undo-store";
import { createCreateLabelClassAndUpdateLabelEffect } from "../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createUpdateLabelClassOfLabelEffect } from "../../../connectors/undo-store/effects/update-label-class-of-label";
import { createCreateLabelClassEffect } from "../../../connectors/undo-store/effects/create-label-class";
import {
  getNextClassColor,
  hexColorSequence,
} from "../../../utils/class-color-generator";
import { createUpdateLabelClassEffect } from "../../../connectors/undo-store/effects/update-label-class";
import { keymap } from "../../../keymap";

import { createCreateLabelEffect } from "../../../connectors/undo-store/effects/create-label";

import { createDeleteLabelEffect } from "../../../connectors/undo-store/effects/delete-label";
import { createCreateLabelClassAndCreateLabelEffect } from "../../../connectors/undo-store/effects/create-label-class-and-create-label";

const getLabelClassesOfDatasetQuery = gql`
  query getLabelClassesOfDataset($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      labelClasses {
        id
        name
        color
      }
    }
  }
`;

const labelClassQuery = gql`
  query getLabelClass($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
      color
    }
  }
`;

const getLabelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      type
      labelClass {
        id
        name
        color
      }
    }
  }
`;

const getImageLabelsQuery = gql`
  query getImageLabels($imageId: ID!) {
    image(where: { id: $imageId }) {
      id
      width
      height
      labels {
        type
        id
        x
        y
        width
        height
        labelClass {
          id
          name
          color
        }
        geometry {
          type
          coordinates
        }
      }
    }
  }
`;

export const EditLabelClassMenu = () => {
  const router = useRouter();
  const datasetSlug = router?.query.datasetSlug as string;

  const workspaceSlug = router?.query.workspaceSlug as string;
  const imageId = router?.query.imageId as string;

  const client = useApolloClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery(getLabelClassesOfDatasetQuery, {
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
  const { data: selectedLabelData } = useQuery(getLabelQuery, {
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
  ].includes(selectedTool);
  const selectedLabelClass = isInDrawingMode
    ? dataLabelClass?.labelClass
    : selectedLabelData?.label?.labelClass;

  const handleCreateNewClass = useCallback(
    async (name) => {
      if (!selectedLabelId) {
        throw new Error("No label selected");
      }
      const newClassColor =
        labelClasses.length < 1
          ? hexColorSequence[0]
          : getNextClassColor(labelClasses[labelClasses.length - 1].color);
      if (!isInDrawingMode) {
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
          query: getImageLabelsQuery,
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
              datasetSlug,
              imageId,
              previouslySelectedLabelClassId: selectedLabelClassId,
              geometry,
              labelType: LabelType.Classification,
              workspaceSlug,
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
            datasetSlug,
            workspaceSlug,
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
            const { data: imageLabelsData } = await client.query({
              query: getImageLabelsQuery,
              variables: { imageId },
            });

            const classificationsOfThisClass =
              imageLabelsData.image.labels.filter(
                (label: Label) =>
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
        const { data: imageLabelsData } = await client.query({
          query: getImageLabelsQuery,
          variables: { imageId },
        });

        const classificationsOfThisClass = imageLabelsData.image.labels.filter(
          (label: Label) =>
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
    (selectedTool === Tools.SELECTION && selectedLabelId != null);

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
