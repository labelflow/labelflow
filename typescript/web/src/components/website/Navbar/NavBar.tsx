import { Box, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { NavContent } from "./NavContent";

export const NavBar = () => {
  return (
    <Box
      as="header"
      bg={useColorModeValue("white", "gray.800")}
      position="relative"
      zIndex="10"
    >
      <Box
        as="nav"
        aria-label="Main navigation"
        maxW="7xl"
        mx="auto"
        px={{ base: "4", md: "8" }}
      >
        <NavContent.Mobile display={{ base: "flex", lg: "none" }} />
        <NavContent.Desktop display={{ base: "none", lg: "flex" }} />
      </Box>
    </Box>
  );
};
