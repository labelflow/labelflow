import React, { forwardRef } from "react";
import { HStack, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

export const ClassificationContent = forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <HStack ref={ref} spacing={2} padding={2} pl={0}>
        <Tag size="md" variant="solid" colorScheme="green">
          <TagLabel>Gray Sky</TagLabel>
          <TagCloseButton />
        </Tag>
        <Tag size="md" variant="solid" colorScheme="red">
          <TagLabel>Cute Horses</TagLabel>
          <TagCloseButton />
        </Tag>
      </HStack>
    );
  }
);
