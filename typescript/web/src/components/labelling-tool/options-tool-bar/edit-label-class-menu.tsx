import { useState, useEffect, useCallback } from "react";
import { gql, useQuery, useApolloClient } from "@apollo/client";

import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import { ClassSelectionMenu, LabelClassItem } from "./class-selection-menu";
import { Tools, useLabellingStore } from "../../../connectors/labelling-state";
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
import { Label, LabelType } from "@labelflow/graphql-types";
import GeoJSON, { GeoJSONPolygon } from "ol/format/GeoJSON";
import { createCreateLabelEffect } from "../../../connectors/undo-store/effects/create-label";
import { Polygon } from "ol/geom";
import { createDeleteLabelEffect } from "../../../connectors/undo-store/effects/delete-label";

const getLabelClassesOfDatasetQuery = gql`
  query getLabelClassesOfDataset($slug: String!) {
    dataset(where: { slug: $slug }) {
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

const labelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
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
  const imageId = router?.query.imageId as string;
  const client = useApolloClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: imageLabelsData } = useQuery(getImageLabelsQuery, {
    skip: !imageId,
    variables: { imageId: imageId as string },
  });

  const { data } = useQuery(getLabelClassesOfDatasetQuery, {
    variables: { slug: datasetSlug },
  });
  const datasetId = data?.dataset.id;
  const { perform } = useUndoStore();
  const labelClasses = data?.dataset.labelClasses ?? [];
  const isContextMenuOpen = useLabellingStore(
    (state) => state.isContextMenuOpen
  );
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const { data: selectedLabelData } = useQuery(labelQuery, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });

  const selectedLabelClassId = useLabellingStore(
    (state) => state.selectedLabelClassId
  );
  const setSelectedLabelClassId = useLabellingStore(
    (state) => state.setSelectedLabelClassId
  );
  const setSelectedLabelId = useLabellingStore(
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
    Tools.CLASSIFICATION,
    Tools.BOX,
    Tools.POLYGON,
  ].includes(selectedTool);
  const selectedLabelClass = isInDrawingMode
    ? dataLabelClass?.labelClass
    : selectedLabelData?.label?.labelClass;

  const handleCreateNewClass = useCallback(
    async (name) => {
      const newClassColor =
        labelClasses.length < 1
          ? hexColorSequence[0]
          : getNextClassColor(labelClasses[labelClasses.length - 1].color);
      if (isInDrawingMode) {
        return await perform(
          createCreateLabelClassEffect(
            {
              name,
              color: newClassColor,
              selectedLabelClassIdPrevious: selectedLabelClassId,
              datasetId,
              datasetSlug,
            },
            { client }
          )
        );
      }
      return await perform(
        createCreateLabelClassAndUpdateLabelEffect(
          {
            name,
            color: newClassColor,
            selectedLabelId,
            datasetId,
            datasetSlug,
          },
          { client }
        )
      );
    },
    [labelClasses, datasetId, selectedTool]
  );

  const handleSelectedClassChange = useCallback(
    (item: LabelClassItem | null) => {
      if (!isInDrawingMode) {
        return perform(
          createUpdateLabelClassOfLabelEffect(
            {
              selectedLabelClassId: item?.id ?? null,
              selectedLabelId,
            },
            { client }
          )
        );
      }
      if (selectedTool === Tools.CLASSIFICATION) {
        const classificationsOfThisClass =
          imageLabelsData?.image?.labels?.filter(
            (label: Label) =>
              label.labelClass?.id === item?.id &&
              label.type === LabelType.Classification
          );
        if (classificationsOfThisClass.length > 0) {
          return perform(
            createDeleteLabelEffect(
              { id: classificationsOfThisClass[0].id },
              { setSelectedLabelId, client }
            )
          );
        }
        console.log("imageLabelsData", imageLabelsData);
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
        console.log("geometry", geometry);
        console.log("item?.id ?? null", item?.id ?? null);
        return perform(
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
      return perform(
        createUpdateLabelClassEffect({
          selectedLabelClassId: item?.id ?? null,
          selectedLabelClassIdPrevious: selectedLabelClassId,
        })
      );
    },
    [selectedLabelId, selectedLabelClassId, selectedTool, imageLabelsData]
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
      {displayClassSelectionMenu && (
        <ClassSelectionMenu
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
