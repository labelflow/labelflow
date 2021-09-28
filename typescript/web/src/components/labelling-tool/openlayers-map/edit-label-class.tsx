import { forwardRef, useCallback } from "react";
import { useQuery, useApolloClient, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { useHotkeys } from "react-hotkeys-hook";
import GeoJSON, { GeoJSONPolygon } from "ol/format/GeoJSON";
import { Polygon } from "ol/geom";
import { Label, LabelType } from "@labelflow/graphql-types";

import { ClassSelectionPopover } from "../../class-selection-popover";
import { Tools, useLabellingStore } from "../../../connectors/labelling-state";
import { useUndoStore } from "../../../connectors/undo-store";
import { createCreateLabelClassAndUpdateLabelEffect } from "../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createUpdateLabelClassOfLabelEffect } from "../../../connectors/undo-store/effects/update-label-class-of-label";
import { keymap } from "../../../keymap";
import {
  getNextClassColor,
  hexColorSequence,
} from "../../../utils/class-color-generator";
import { LabelClassItem } from "../../class-selection-popover/class-selection-popover";
import { createCreateLabelEffect } from "../../../connectors/undo-store/effects/create-label";
import { createDeleteLabelEffect } from "../../../connectors/undo-store/effects/delete-label";
import { createCreateLabelClassAndCreateLabelEffect } from "../../../connectors/undo-store/effects/create-label-class-and-create-label";

const getLabelClassesOfDatasetQuery = gql`
  query getLabelClassesOfDataset($slug: String!) {
    dataset(where: { slugs: { datasetSlug: $slug, workspaceSlug: "local" } }) {
      id
      labelClasses {
        id
        name
        color
      }
    }
  }
`;

const labelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      type
      labelClass {
        id
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

export const EditLabelClass = forwardRef<
  HTMLDivElement | null,
  {
    isOpen: boolean;
    onClose: () => void;
  }
>(({ isOpen, onClose }, ref) => {
  const router = useRouter();
  const imageId = router?.query.imageId as string;
  const datasetSlug = router?.query.datasetSlug as string;

  const client = useApolloClient();
  const { data } = useQuery(getLabelClassesOfDatasetQuery, {
    variables: { slug: datasetSlug },
    skip: !datasetSlug,
  });
  const datasetId = data?.dataset.id;
  const { perform } = useUndoStore();
  const labelClasses = data?.dataset.labelClasses ?? [];
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  const isContextMenuOpen = useLabellingStore(
    (state) => state.isContextMenuOpen
  );
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const { data: labelQueryData } = useQuery(labelQuery, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const selectedLabelClassId = labelQueryData?.label?.labelClass?.id ?? null;

  const handleCreateNewClass = useCallback(
    async (name) => {
      const newClassColor =
        labelClasses.length < 1
          ? hexColorSequence[0]
          : getNextClassColor(labelClasses[labelClasses.length - 1].color);
      if (selectedLabelId != null) {
        onClose();
        await perform(
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
        return;
      }

      if (selectedTool === Tools.CLASSIFICATION && imageId) {
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
        onClose();
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
            },
            {
              setSelectedLabelId,
              client,
            }
          )
        );
      }
    },
    [labelClasses, datasetId, selectedLabelId, selectedTool, imageId]
  );

  const handleSelectedClassChange = useCallback(
    async (item: LabelClassItem | null) => {
      if (selectedLabelId != null) {
        perform(
          createUpdateLabelClassOfLabelEffect(
            {
              selectedLabelClassId: item?.id ?? null,
              selectedLabelId,
            },
            { client }
          )
        );
        onClose();
        return;
      }
      if (selectedTool === Tools.CLASSIFICATION && imageId) {
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
          perform(
            createUpdateLabelClassOfLabelEffect(
              {
                selectedLabelId,
                selectedLabelClassId: labelClasses[indexOfLabelClass]?.id,
              },
              { client }
            )
          );
          onClose();
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
          !(labelQueryData?.label?.type === LabelType.Classification) &&
          // No None Class when adding Classification Labels
          !(
            selectedTool === Tools.CLASSIFICATION &&
            labelQueryData?.label == null
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
