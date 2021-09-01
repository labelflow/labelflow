import {
  chakra,
  Box,
  Button,
  Heading,
  Img,
  // Link,
  Stack,
  Text,
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
    href="https://github.com/Labelflow/labelflow"
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
              Create and manage your image data, workflows and teams in a single
              place. Stay in control of your data, focus on building the next
              big thing.
            </Text>
            <Stack
              direction={{ base: "column", md: "row" }}
              justifyContent="space-around"
              mt="8"
            >
              <GithubButton />
              <NextLink href="/local/datasets">
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
          <Box
            pos="relative"
            w={{ base: "full", lg: "560px" }}
            h={{ base: "auto", lg: "560px" }}
          >
            <Img
              w="full"
              transform={{ base: "", lg: "scale(1.1)", xl: "scale(1.3)" }}
              pos="relative"
              zIndex="1"
              rounded={8}
              h={{ lg: "100%" }}
              objectFit="contain"
              backgroundSize="contain"
              backgroundRepeat="no-repeat"
              backgroundPosition="center"
              bg="data:image/png;base64,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"
              src="/static/img/home-screenshot5.png"
              alt="Screening talent"
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
