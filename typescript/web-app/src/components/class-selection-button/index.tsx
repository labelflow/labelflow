import React from "react";
import { useEffect, useState } from "react";
import { Box, Kbd, Flex, Input, Button, chakra } from "@chakra-ui/react";
import { RiCloseCircleFill } from "react-icons/ri";

const CloseCircleIcon = chakra(RiCloseCircleFill);

export const ClassSelectionButton = ({ labelClass }) => {
  const name = labelClass?.name;
  return (
    <Box {} pl="3" pr="3">
      <Button
        leftIcon={
          name
            ? () => (
                <CloseCircleIcon
                  fontSize="2xl"
                  color="gray.300"
                />
              )
            : null
        }
      >
        "Select class"
      </Button>
    </Box>
  );
};
