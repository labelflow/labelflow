import {
  Box,
  Button,
  Heading,
  LightMode,
  Text,
  Center,
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
            color="gray.600"
          >
            Product Release
            <br />01-2022
          </Heading>

          <Text mt="4" fontSize="lg" color="gray.800">
            Over the last months we have been working hard to release a new
            version of LabelFlow, the open platform for image labeling. In short
            you can now collaborate online and label your datasets faster using
            the Auto Polygon feature powered by AI.
            <br />
            <br />
          </Text>

          <Center>
            <Box>
              <LightMode>
                <Button
                  mt="8"
                  as="a"
                  href="https://labelflow.ai/posts/product-release-collaboration-and-boosted-labeling-productivity-with-auto-polygon-1"
                  target="blank"
                  size="lg"
                  colorScheme="brand"
                  fontWeight="bold"
                >
                  Discover what's new
                </Button>
              </LightMode>
            </Box>
          </Center>
        </Box>
      </Box>
    </Box>
  );
};
