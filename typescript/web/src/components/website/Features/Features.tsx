import {
  Box,
  Heading,
  Img,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import {
  BsFillEmojiSmileFill,
  BsFillLightningFill,
  BsHeartFill,
} from "react-icons/bs";
import { getImageUrl } from "../get-image-url";
import { TryHeroButton } from "../try-hero-button";
import { Feature } from "./Feature";

export const Features = () => {
  return (
    <Box
      id="features"
      as="section"
      py={{ md: "12" }}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
        py={{ base: "12", md: "20" }}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="10">
          <Box>
            <Heading size="xl" mb="4" fontWeight="extrabold">
              The image labeling tool you need to unleash your AI projects
            </Heading>
            <Text
              fontSize={{ md: "lg" }}
              mb="6"
              maxW="md"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Building large and accurate datasets for machine learning
              algorithms has never been that easy
            </Text>
          </Box>
          <Img
            htmlWidth="500px"
            htmlHeight="320px"
            height={{ md: "320px" }}
            objectFit="contain"
            src={getImageUrl("feature-picture.jpg")}
            alt="Feature picture"
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 3 }} mt="16" spacing="8">
          <Feature icon={BsFillLightningFill} title="Build datasets at scale">
            LabelFlow is an image labeling tool designed for optimum
            productivity. Keyboard shortcuts, interface layout, collaboration,
            everything is designed to build the most accurate datasets for
            machine learning.
          </Feature>
          <Feature icon={BsFillEmojiSmileFill} title="Optimum user experience">
            Our obsession is to develop and keep developing a simple product. We
            prefer you to focus on building the next big thing with AI rather
            than finding a button to upload images.
          </Feature>
          <Feature icon={BsHeartFill} title="Open community and standard">
            We believe that collaboration could be the new word for competition.
            We have made our{" "}
            <Link color="brand.600" href="https://labelflow.ai/open">
              KPIs public
            </Link>
            , our code is open under Business Source Licence and that is just
            the beginning.
          </Feature>
        </SimpleGrid>
        <Stack
          direction={{ base: "column", md: "row" }}
          justifyContent="space-around"
          mt="8"
        >
          <TryHeroButton />
        </Stack>
      </Box>
    </Box>
  );
};
