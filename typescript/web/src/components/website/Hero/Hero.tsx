import {
  chakra,
  Box,
  Button,
  Heading,
  AspectRatio,
  // Link,
  Stack,
  Text,
  Flex,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";
import { RiGithubFill } from "react-icons/ri";
import { BsArrowRight } from "react-icons/bs";
// import { GithubButton } from "../Navbar/NavContent";

const GithubIcon = chakra(RiGithubFill);
export const GithubButton = () => (
  <Button
    as="a"
    leftIcon={<GithubIcon fontSize="2xl" />}
    href="https://github.com/labelflow/labelflow"
    target="blank"
    size="lg"
    minW="210px"
    variant="link"
    height="14"
    px="8"
  >
    See on Github
  </Button>
);

export function Hero() {
  return (
    <Box
      as="section"
      // bg={mode("gray.50", "gray.800")}
      pt="16"
      pb="24"
    >
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: "3rem", lg: "2rem" }}
          mt="8"
          align={{ lg: "center" }}
          justify="space-between"
        >
          <Box flex="1" maxW={{ lg: "520px" }}>
            {/* <Text
              size="xs"
              textTransform="uppercase"
              fontWeight="semibold"
              color={mode("brand.600", "brand.300")}
              letterSpacing="wide"
            >
              Hire Talents
            </Text> */}
            <Heading
              as="h1"
              size="3xl"
              color={mode("gray.600", "gray.300")}
              mt="8"
              py="6"
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              The open{" "}
              <Text
                color="brand.500"
                // bgGradient="linear(to-l, brand.500,brand.400)"
                // bgClip="text"
                display="inline"
              >
                platform for image labeling
              </Text>
            </Heading>
            <Text
              color={mode("gray.600", "gray.400")}
              mt="4"
              fontSize="lg"
              fontWeight="medium"
            >
              Create and manage large image datasets for machine learning in a
              single place. Labelflow is the open image annotation tool to build
              the next big thing with AI.
            </Text>
            <Stack
              direction={{ base: "column", md: "row" }}
              justifyContent="space-around"
              mt="8"
            >
              <GithubButton />
              <NextLink href="/auth/signin">
                <Button
                  size="lg"
                  minW="210px"
                  colorScheme="brand"
                  height="14"
                  px="8"
                  rightIcon={<BsArrowRight />}
                >
                  Try it now
                </Button>
              </NextLink>
              {/* <Button
                size="lg"
                bg="white"
                color="gray.900"
                _hover={{ bg: "gray.50" }}
                height="14"
                px="8"
                shadow="base"
                leftIcon={<Box as={HiPlay} fontSize="2xl" />}
              >
                Watch Demo
              </Button> */}
            </Stack>
            {/* <Text mt="8" color={mode("gray.600", "gray.400")}>
              Already have an account store?{" "}
              <Link href="#" textDecoration="underline">
                Log in
              </Link>
            </Text> */}
          </Box>
          <Flex
            direction="column"
            justify="center"
            flexGrow={1}
            pos="absolut"
            minW={{ base: "full", lg: "560px" }}
            h={{ base: "auto", lg: "560px" }}
          >
            <AspectRatio ratio={16 / 9}>
              <video playsInline autoPlay muted loop>
                <source src="/static/img/home-video.webm" type="video/webm" />
              </video>
            </AspectRatio>
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
}
