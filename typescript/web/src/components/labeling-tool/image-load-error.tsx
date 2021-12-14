import React from "react";
import { Box, Center, Text, Heading } from "@chakra-ui/react";
import { EmptyStateImageNotFound } from "../empty-state";

export const ImageLoadError = () => (
  <Center h="full">
    <Box as="section">
      <Box
        maxW="2xl"
        mx="auto"
        px={{ base: "6", lg: "8" }}
        py={{ base: "16", sm: "20" }}
        textAlign="center"
      >
        <EmptyStateImageNotFound w="full" />
        <Heading as="h2">Oops, there is an error loading this image</Heading>
        <Text mt="4" fontSize="lg">
          You can try reloading the page
        </Text>
      </Box>
    </Box>
  </Center>
);
