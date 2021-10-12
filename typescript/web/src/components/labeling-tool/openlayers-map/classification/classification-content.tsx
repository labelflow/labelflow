import React, { forwardRef, useCallback } from "react";
import { HStack, Box } from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useQuery, gql, useApolloClient } from "@apollo/client";

import { Label, LabelType } from "@labelflow/graphql-types";

import { Tools, useLabelingStore } from "../../../../connectors/labeling-state";

import { useUndoStore } from "../../../../connectors/undo-store";
import { ClassificationTag, LabelClassItem } from "./classification-tag";
import {
  getNextClassColor,
  hexColorSequence,
} from "../../../../utils/class-color-generator";
import { createCreateLabelClassAndUpdateLabelEffect } from "../../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createUpdateLabelClassOfLabelEffect } from "../../../../connectors/undo-store/effects/update-label-class-of-label";
import { createDeleteLabelEffect } from "../../../../connectors/undo-store/effects/delete-label";

const getLabelClassesOfDatasetQuery = gql`
  query getLabelClassesOfDataset($slug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: "local" } }) {
      id
      labelClasses {
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

export const ClassificationContent = forwardRef<HTMLDivElement>(
  (props, ref) => {
    const router = useRouter();
    const datasetSlug = router?.query.datasetSlug as string;
    const workspaceSlug = router?.query.workspaceSlug as string;
    const imageId = router?.query.imageId as string;
    const { data: getImageLabelsData, previousData: previousImageLabelsData } =
      useQuery(getImageLabelsQuery, {
        skip: !imageId,
        variables: { imageId: imageId as string },
      });
    const { data: labelClassesData } = useQuery(getLabelClassesOfDatasetQuery, {
      variables: { slug: datasetSlug },
    });
    const datasetId = labelClassesData?.dataset.id;
    const labelClasses = labelClassesData?.dataset.labelClasses ?? [];
    const selectedTool = useLabelingStore((state) => state.selectedTool);

    const isInDrawingMode = [Tools.BOX, Tools.POLYGON].includes(selectedTool);
    const { perform } = useUndoStore();
    const client = useApolloClient();
    const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
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
              ? hexColorSequence[0]
              : getNextClassColor(labelClasses[labelClasses.length - 1].color);

          await perform(
            createCreateLabelClassAndUpdateLabelEffect(
              {
                name,
                color: newClassColor,
                selectedLabelId,
                datasetId,
                datasetSlug,
                workspaceSlug,
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
          {labels
            .filter(({ type }: Label) => type === LabelType.Classification)
            .map((label: Label) => {
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
