import { useApolloClient, useQuery } from "@apollo/client";
import { Box, HStack } from "@chakra-ui/react";
import { getNextClassColor, LABEL_CLASS_COLOR_PALETTE } from "@labelflow/utils";
import { isEmpty } from "lodash/fp";
import React, { forwardRef, useCallback } from "react";
import { Tools, useLabelingStore } from "../../../../connectors/labeling-state";
import { useUndoStore } from "../../../../connectors/undo-store";
import { createCreateLabelClassAndUpdateLabelEffect } from "../../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createDeleteLabelEffect } from "../../../../connectors/undo-store/effects/delete-label";
import { createUpdateLabelClassOfLabelEffect } from "../../../../connectors/undo-store/effects/update-label-class-of-label";
import {
  GetImageLabelsQuery,
  GetImageLabelsQueryVariables,
} from "../../../../graphql-types/GetImageLabelsQuery";
import { LabelType } from "../../../../graphql-types/globalTypes";
import { useDataset, useWorkspace, useDatasetImage } from "../../../../hooks";

import {
  GET_IMAGE_LABELS_QUERY,
  GET_LABEL_CLASSES_OF_DATASET_QUERY,
} from "../queries";
import { ClassificationTag, LabelClassItem } from "./classification-tag";

export const ClassificationContent = forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { slug: workspaceSlug } = useWorkspace();
    const { slug: datasetSlug } = useDataset();
    const { id: imageId } = useDatasetImage();
    const { data: getImageLabelsData, previousData: previousImageLabelsData } =
      useQuery<GetImageLabelsQuery, GetImageLabelsQueryVariables>(
        GET_IMAGE_LABELS_QUERY,
        { variables: { imageId }, skip: isEmpty(imageId) }
      );
    const { data: labelClassesData } = useQuery(
      GET_LABEL_CLASSES_OF_DATASET_QUERY,
      {
        variables: { slug: datasetSlug, workspaceSlug },
        skip: !datasetSlug || !workspaceSlug,
      }
    );
    const datasetId = labelClassesData?.dataset.id;
    const labelClasses = labelClassesData?.dataset.labelClasses ?? [];
    const selectedTool = useLabelingStore((state) => state.selectedTool);

    const isInDrawingMode = [Tools.BOX, Tools.POLYGON].includes(selectedTool);
    const { perform } = useUndoStore();
    const client = useApolloClient();
    const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
    const showLabelsGeometry = useLabelingStore(
      (state) => state.showLabelsGeometry
    );
    const labels =
      getImageLabelsData?.image?.labels ??
      previousImageLabelsData?.image?.labels ??
      [];
    const setSelectedLabelId = useLabelingStore(
      (state) => state.setSelectedLabelId
    );

    const handleCreateNewClass = useCallback(
      async (name) => {
        if (selectedLabelId != null) {
          // Update class of an existing label with a new class
          const newClassColor =
            labelClasses.length < 1
              ? LABEL_CLASS_COLOR_PALETTE[0]
              : getNextClassColor(
                  labelClasses.map((labelClass: any) => labelClass.color)
                );

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
        }
      },
      [labelClasses, datasetId, selectedLabelId]
    );

    const handleSelectedClassChange = useCallback(
      async (item: LabelClassItem | null) => {
        if (selectedLabelId != null) {
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

          await perform(
            createUpdateLabelClassOfLabelEffect(
              {
                selectedLabelClassId: item?.id ?? null,
                selectedLabelId,
              },
              { client }
            )
          );
        }
      },
      [selectedLabelId, selectedTool, imageId]
    );

    return (
      <Box
        overflow="visible"
        w="0"
        h="0"
        m="0"
        p="0"
        display="inline"
        cursor="pointer"
        pointerEvents="none"
      >
        <HStack
          ref={ref}
          spacing={2}
          padding={2}
          pointerEvents={isInDrawingMode ? "none" : "initial"}
        >
          {showLabelsGeometry &&
            labels
              .filter(({ type }) => type === LabelType.Classification)
              .map((label) => {
                return (
                  <ClassificationTag
                    key={label.id}
                    label={label}
                    client={client}
                    setSelectedLabelId={setSelectedLabelId}
                    createNewClass={handleCreateNewClass}
                    labelClasses={labelClasses}
                    selectedLabelId={selectedLabelId}
                    onSelectedClassChange={handleSelectedClassChange}
                  />
                );
              })}
        </HStack>
      </Box>
    );
  }
);
