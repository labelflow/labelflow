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
            Webinar - Get an AI model ready in no time
          </Heading>

          <Text mt="4" fontSize="lg" color="gray.800">
<<<<<<< HEAD
            From preserving whales to preventing wild fires and developing a
            fitness app to workout during Covid. Discover how AI impacts your
            day to day life with leaders from around the world.
            <br />
            <br />
            <b> From Wednesday November 27th, 2021</b>
=======
            From image labeling to automatic inference, discover how to build a
            proof of concept model for your custom use case in no time. We will
            go through a real life use case: equipment inventory on the
            distribution electrical system.
            <br />
            <br />
            <b> Sept 28th - 4.30pm CET Time - Duration: 45min</b>
>>>>>>> parent of 9a9efe53 (Update index.tsx)
          </Text>

          <LightMode>
            <Button
              mt="8"
              as="a"
<<<<<<< HEAD
              href="https://labelflow.ai/posts
=======
              href="https://app.livestorm.co/labelflow/get-an-ai-model-ready-in-no-time
>>>>>>> parent of 9a9efe53 (Update index.tsx)
            "
              target="blank"
              size="lg"
              colorScheme="brand"
              fontWeight="bold"
            >
<<<<<<< HEAD
              Visit Now
=======
              Register now
>>>>>>> parent of 9a9efe53 (Update index.tsx)
            </Button>
          </LightMode>
        </Box>
      </Box>
    </Box>
  );
};
