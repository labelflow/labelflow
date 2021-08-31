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
              The open standard platform{" "}
              <Text
                color="brand.500"
                // bgGradient="linear(to-l, brand.500,brand.400)"
                // bgClip="text"
                display="inline"
              >
                for image labeling
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
              bg="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAUCAYAAAAHpoRMAAAACXBIWXMAAAAnAAAAJwEqCZFPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAP5SURBVHgB7ZVNbxNnFIWfGdvj8ef4I8QOISSBEkBCKq2EWqkLqNoFqoTU/oHSZbf9B60q9T+UXReVKrrtgl0pK4SgUFVQ2oTEIbZjHH+Mx+OZ8Yw905t07RKRFRJ3YVnvnblz7nnPuRfexGsQyqxE33a/6HV6lw0jh+f56GmdIAgOcgPTJB6LkS8UGA4sjh+voidis0rRMy2zXDS+4iURn5X48MatK70fvrmuxBTmKjm6bYdIjQt6haQAqx7Lc3q1yKW1CsfKGbJ6nPHEJ53UmE6n/L3RwhtHrJxcJWcs1qTkq4O58dFZLn/XIKHrENi8dWqOioAqL65xYklnIatjjUaYvefsdiLeOb9EOpVkHDi4vsviCSmtKMSiBiOrzmFiJpgHD37j8+vvMT+Xppwv0xuYFAydLdumGaj0Rz5NZ8LxeCRsJLCmHnu7XZxxSEwFexhgGBpD20dNhBwJzP0/bx5Q3hkM6Fi2dOvT6EuzWoy3K8vU5azS7/JPo8Ha8gJP+i1OLxqoakR/4BBEPp3nPbxJiO9NOEyosxJDb8rzF0P2Nbtf3J2qcqZhmQHbtW2OZYp0bYtCNoXvj0WkQ9zQ51m9xdD1GFo+2XSBQi5L/H/EfShmYsK1JVdxciEuQtRQ9QLePOTLJ2nuPuFMVUevKThyHdMwiaZp1OoDRraLI9+OoeGHJmEozEyPyEw6mUdLqtT2BvScPTa3HqO88EmZNmEwIZ8rkvTEW0sX2LZlQijy+USWUqYK0ZTdVptuX54VRkP1UFhmg3na2CElTjJ7LtNIkaIRD+/co73+kNPl84ReiKWKu5QEgTalP1HpVs9iiss0sb5WilPf7Qsz8KLlcpiYeU26nsAcufjSpbVj0qrbXPpgHtOxePz4Nsuig0unVnHVFBk9xp0/7nNup8VmZ5OSOhFyVPRMkp09EbHtcSQwuUKMemOE50bUty3OnDEIlYhIWp0T0eazedY3Nthab+PPT/jk3SsoukKz+RBf+E6J5cuFFN2eRd7IcCQwk7DKaiXBX+0mJxZEK0WFbmcoDpFu2yJUy6LVcVjf3CI/0fll/SalaplSMcXWVkdWRZK5UoZnOz5GuciRwHz75dc4jsP93+/x46/f02l7TP3pwUQ2tKqIO0kwHGPI1N3XiBuMMft9cZ6wVkyzs2GSz2co5QwarSFHAjOyHXGHwkQPGAw8yqUk1UqVZxtd0UCNfucC+/qPyxBUxC56WnZSEOKOAsaOZBLQbPS49vF1VpbW+Ozna7wsZm7tgoRX0Avvf7qCZ8qB/FwsXOSn27e4evUcy/J/3JKEKQtRZk6tVUPWp7z4n1gfPW1x8dyKOMHk0V2T2t1ajTfxivEveWrQNXmu5GgAAAAASUVORK5CYII=')"
              backgroundSize="contain"
              backgroundRepeat="no-repeat"
              backgroundPosition="center"
              src="/static/img/home-screenshot5.png"
              alt="Screening talent"
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
