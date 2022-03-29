import {
  Box,
  Button,
  Heading,
  Img,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import * as React from "react";

export const Roadmap = () => {
  return (
    <Box
      as="section"
      py={{ md: "12" }}
      bg={useColorModeValue("white", "gray.900")}
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
              Vote on our feature roadmap
            </Heading>
            <Text
              fontSize={{ md: "lg" }}
              mb="6"
              maxW="md"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              We make our roadmap transparent and we value your feedback. We are
              a small passionate team, we want to build the features that matter
              to you. Workflows, active learning, smart tools, online version,
              datasets versioning, discover our plan here (our friends from
              Canny support us)
            </Text>

            <Button
              as="a"
              href="https://labelflow.canny.io/feature-requests"
              target="blank"
              rel="noopener"
              size="lg"
              colorScheme="brand"
              rightIcon={<BsArrowRight />}
              fontWeight="bold"
              fontSize="md"
              w={{ base: "full", sm: "auto" }}
            >
              Vote
            </Button>
          </Box>
          <Img
            htmlWidth="500px"
            htmlHeight="280px"
            height={{ md: "400px" }}
            objectFit="contain"
            src="/static/img/roadmap.svg"
            alt="state of the art speaker"
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
};
