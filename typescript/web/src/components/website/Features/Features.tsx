import {
  Box,
  Heading,
  Img,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import {
  BsFillLightningFill,
  BsFillShieldLockFill,
  BsHeartFill,
} from "react-icons/bs";
import { Feature } from "./Feature";

export const Features = () => {
  return (
    <Box as="section" py={{ md: "12" }} bg={mode("gray.50", "gray.800")}>
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
        py={{ base: "12", md: "20" }}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="10">
          <Img
            htmlWidth="500px"
            htmlHeight="320px"
            height={{ md: "320px" }}
            objectFit="cover"
            src="/static/img/shot-elec-1.jpg"
            alt="state of the art speaker"
          />
          <Box>
            <Heading size="xl" mb="4" fontWeight="extrabold">
              The image labeling tool you need to unleash your AI projects
            </Heading>
            <Text
              fontSize={{ md: "lg" }}
              mb="6"
              maxW="md"
              color={mode("gray.600", "gray.400")}
            >
              Building large and accurate datasets for machine learning
              algorithms has never been that easy
            </Text>
          </Box>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 3 }} mt="16" spacing="8">
          <Feature
            icon={BsFillLightningFill}
            title="Blazing Fast Image Labeling Tool"
          >
            LabelFlow is an image labeling tool designed for optimum
            productivity. Keyboard shortcuts, interface layout, collaboration,
            everything is designed to build the most accurate datasets for
            machine learning.
          </Feature>
          <Feature
            icon={BsFillShieldLockFill}
            title="Own your data and algorithms"
          >
            LabelFlow image annotation tool does not try to own your data or
            algorithms, but integrates with them seamlessly. No duplicate source
            of truth and complicated scripts to synchronize your data between
            various tools.
          </Feature>
          <Feature icon={BsHeartFill} title="Open community and standard">
            LabelFlow is building a community around an open source data
            labeling tool (under Business Source Licence) to set the standard
            around visual data management. Data cleaning should not require any
            &ldquo;secret sauce&rdquo;.
          </Feature>
        </SimpleGrid>
      </Box>
    </Box>
  );
};
