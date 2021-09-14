import React, { forwardRef } from "react";
import { HStack, Box, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

export const ClassificationContent = forwardRef<HTMLDivElement>(
  (props, ref) => {
    return (
      <Box overflow="visible" w="0" h="0" m="0" p="0" display="inline">
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
      </Box>
    );
  }
);
