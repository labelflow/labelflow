import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { Quotee } from "./quotee";
import { QuoteIcon } from "./quote-icon";

export const Proof = () => (
  <Box as="section" bg={useColorModeValue("gray.50", "gray.800")}>
    <Box maxW="3xl" mx="auto" px={{ base: "6", md: "8" }} pt="12" pb="16">
      <Flex direction="column" align="center" textAlign="center">
        <QuoteIcon
          color={useColorModeValue("gray.300", "gray.600")}
          fontSize={{ base: "3xl", md: "6xl" }}
        />
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="medium" mt="6">
          &ldquo; LabelFlow works at scale! Its technology was used by Sterblue
          to label 1.5 million images for hundreds of customers accross the
          energy industry. &rdquo;
        </Text>
        <Quotee
          name="Sterblue"
          jobTitle="AI-Powered platform for the energy space"
          imageSrc="../static/img/sterblue-logo.png"
          mt="8"
        />
      </Flex>
    </Box>
  </Box>
);
