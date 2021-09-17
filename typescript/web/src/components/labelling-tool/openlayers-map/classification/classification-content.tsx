import React, { forwardRef } from "react";
import { HStack, Box, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useQuery, gql, useApolloClient } from "@apollo/client";

import { Label, LabelType } from "@labelflow/graphql-types";

import {
  Tools,
  useLabellingStore,
} from "../../../../connectors/labelling-state";

import { noneClassColor } from "../../../../utils/class-color-generator";
import { createDeleteLabelEffect } from "../../../../connectors/undo-store/effects/delete-label";
import { useUndoStore } from "../../../../connectors/undo-store";

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
    const { imageId } = useRouter()?.query;
    const { data, previousData } = useQuery(getImageLabelsQuery, {
      skip: !imageId,
      variables: { imageId: imageId as string },
    });
    const selectedTool = useLabellingStore((state) => state.selectedTool);

    const isInDrawingMode = [Tools.BOX, Tools.POLYGON].includes(selectedTool);
    const { perform } = useUndoStore();
    const client = useApolloClient();
    const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
    const labels = data?.image?.labels ?? previousData?.image?.labels ?? [];
    const setSelectedLabelId = useLabellingStore(
      (state) => state.setSelectedLabelId
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
            .map(({ id, labelClass }: Label) => {
              return (
                <Tag
                  key={id}
                  size="md"
                  variant="solid"
                  background={`${labelClass?.color ?? noneClassColor}AA`}
                  borderColor={
                    id === selectedLabelId
                      ? labelClass?.color ?? noneClassColor
                      : "transparent"
                  }
                  color={labelClass ? "white" : "black"}
                  borderStyle="solid"
                  borderWidth={4}
                  onClick={() => setSelectedLabelId(id)}
                  cursor="pointer"
                  boxSizing="content-box"
                >
                  <TagLabel>{labelClass?.name ?? "None"}</TagLabel>
                  <TagCloseButton
                    onClick={(e) => {
                      e.stopPropagation();
                      return perform(
                        createDeleteLabelEffect(
                          { id },
                          { setSelectedLabelId, client }
                        )
                      );
                    }}
                  />
                </Tag>
              );
            })}
        </HStack>
      </Box>
    );
  }
);
