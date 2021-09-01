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
