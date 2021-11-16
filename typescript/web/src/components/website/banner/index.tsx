import {
  Box,
  Button,
  Heading,
  LightMode,
  Text,
  useTheme,
} from "@chakra-ui/react";
import * as React from "react";

export const Banner = () => {
  const theme = useTheme();

  const color1 = theme?.colors?.brand?.["200"];
  const color2 = theme?.colors?.brand?.["50"];

  return (
    <Box
      id="banner"
      as="section"
      bgGradient={`linear(to-r, ${color1}, ${color2})`}
    >
      <Box>
        <Box
          maxW="2xl"
          mx="auto"
          px={{ base: "6", lg: "8" }}
          py={{ base: "16", sm: "20" }}
          textAlign="center"
        >
          <Heading
            as="h2"
            size="3xl"
            fontWeight="extrabold"
            letterSpacing="tight"
            color="gray.800"
          >
            AI Stories by LabelFlow
          </Heading>

          <Text mt="4" fontSize="lg" color="gray.800">
            From preserving whales to preventing wild fires and developing a
            fitness app to workout during Covid. Discover how AI impacts your
            day to day life with leaders from around the world.
            <br />
            <br />
            <b> From Wednesday November 27th, 2021</b>
          </Text>

          <LightMode>
            <Button
              mt="8"
              as="a"
              href="https://labelflow.ai/posts
            "
              target="blank"
              size="lg"
              colorScheme="brand"
              fontWeight="bold"
            >
              Visit Now
            </Button>
          </LightMode>
        </Box>
      </Box>
    </Box>
  );
};
