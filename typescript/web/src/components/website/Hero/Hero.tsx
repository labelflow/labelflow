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
                platform for image labelling
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
              backgroundImage="url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFKADAAQAAAABAAAADAAAAAARd0G9AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAAC/0lEQVQoFT2T228bRRSHv5mdvTi72cbBdkSahKaXtJGCQCBEpbYSqnjhGSHxhMQ7/0zFE38DUl/7UAkkriKoagUvIY2TJhG1Q5rN2mvHa3tmh0momNHcjmbmnPmdbwSvSzfLPvel93Wg1JFSvi+w/1ULlWtSiIudla3+n8O5zeJJz0hPzmpttlS3KFoLSTHI+97aXJo2ynHZCEKF1prtvQ7jqeZsWFDpMYmaMOifEPgh0vOJ4jn2dw8xImB3+wU3128IcdrvP7Na3DTWn/bPTFyMRGWFENaFZaspwh20laEyxkXmInWdMdo5tKSJZLHhsfP8L/1k80l449bGtsjy/LA3vbT0+E/Ni1P4rWNZiiY0R22uTHfYmr3PoU5J5dRFJVES6jXItODusuWzD2Em8o0ze5OKtlKeN+pk8GvPTt+eHfqfhl2SMEP2dohetUkWmzTMu2hCYjkhDKRrHquiYmm+choqfvjue/vs8UPufPwJygqlli5N+GJ5V6bBK0bViCpKKbw6utfgWmvMitim721gvNglACLOmFEhrdhdKCRx6PPOSkooLSIfjtv50f7VzV8emdn6vGeF00wFlN1D5Ms9vOvvMzBjRu7ZxaSFLAtW0yNe9mOaK2t8dG+dpBZoX3mqnJi28pzI+UDz7WbB1ZbEjgdUYc15OuaWOeZ5v03g9LusOtSMYH+0RhkXPD0O+SBZuEBoUE5treZRTqaVstZiHEuH+CyHMaX1GTvuLgeKhnvWXDykV6Vk8jZZuMDBoKJrCs4WU+J09oJV151jizZaKuEFxAF82fwdTIPT04zVuu+kOYZhjz/yu3zjMp9HA0p9wpsMWGs22TvLuP9WdKGh48pl4hx+KZUZ5k7ckOtX1pFJg+i9OU46f5OPFbVajTfMAl+VFVYbB3aFcaMjg85UMT+f6Lk4VP1i9OCgc/qgHvmp6m49ZVCO6M9scOf2PeJ6i59+/pG1ZIbQZU/mgth3qDjIbRCinMahGJOphMitj/8p8JQ8uLY4f3D+N/8FfMZadBxcaqEAAAAASUVORK5CYII=')"
              src="/static/img/home-screenshot5.png"
              alt="LabelFlow"
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
