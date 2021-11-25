import React from "react";
import { Box, Center, Text, Heading, Image } from "@chakra-ui/react";

export const ImageLoadError = () => (
  <Center h="full">
    <Box as="section">
      <Box
        maxW="3xl"
        mx="auto"
        px={{ base: "6", lg: "8" }}
        py={{ base: "16", sm: "20" }}
        textAlign="center"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          src="/static/graphics/png/broken-image.png"
          maxWidth={250}
          padding={6}
          opacity={0.7}
          boxSizing="border-box"
        />
        <Heading as="h2">Oops, there is an error loading this image</Heading>
        <Text mt="4" fontSize="lg">
          You can try reloading the page
        </Text>
      </Box>
    </Box>
  </Center>
);
