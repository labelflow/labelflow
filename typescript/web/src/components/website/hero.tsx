import {
  AspectRatio,
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiGithubFill } from "react-icons/ri";
import { APP_GITHUB_URL } from "../../constants";
import { getImageUrl } from "./get-image-url";
import { TryHeroButton } from "./try-hero-button";

const CatchPhrase = () => (
  <Heading
    as="h1"
    size="3xl"
    color={useColorModeValue("gray.600", "gray.300")}
    py="6"
    fontWeight="extrabold"
    letterSpacing="tight"
  >
    The open{" "}
    <Text color="brand.500" display="inline">
      platform for image labeling
    </Text>
  </Heading>
);

const Description = () => (
  <Text
    color={useColorModeValue("gray.600", "gray.400")}
    mt="4"
    fontSize="lg"
    fontWeight="medium"
  >
    Create and manage large image datasets for machine learning in a single
    place. LabelFlow is the open image annotation tool to build the next big
    thing with AI.
  </Text>
);

const GithubIcon = chakra(RiGithubFill);

const GithubButton = () => (
  <Button
    as="a"
    leftIcon={<GithubIcon fontSize="2xl" />}
    href={APP_GITHUB_URL}
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

const Actions = () => (
  <Stack
    direction={{ base: "column", md: "row" }}
    justifyContent="space-around"
    mt="8"
  >
    <GithubButton />
    <TryHeroButton />
  </Stack>
);

const LeftSide = () => (
  <Box flex="1">
    <CatchPhrase />
    <Description />
    <Actions />
  </Box>
);

export const Video = () => (
  <AspectRatio
    ratio={16 / 9}
    borderWidth="1px"
    borderStyle="solid"
    borderColor={useColorModeValue("gray.200", "gray.600")}
  >
    <video playsInline autoPlay muted loop>
      <source src={getImageUrl("hero-video.webm")} />
      <img src={getImageUrl("hero-image.jpg")} alt="LabelFlow screenshot" />
    </video>
  </AspectRatio>
);

const RightSide = () => (
  <Flex
    direction="column"
    justify="center"
    flexGrow={1}
    pos="relative"
    maxH="0"
    minW={{ base: "full", lg: "560px" }}
    h={{ base: "auto", lg: "560px" }}
  >
    <Video />
  </Flex>
);

const Body = () => (
  <Stack
    direction={{ base: "column", lg: "row" }}
    spacing={{ base: "3rem", lg: "2rem" }}
    mt="8"
    align={{ lg: "center" }}
    justify="space-between"
  >
    <LeftSide />
    <RightSide />
  </Stack>
);

export const Hero = () => (
  <Box as="section" pt="16" pb="24">
    <Box maxW={{ base: "xl", md: "7xl" }} mx="auto" px={{ base: "6", md: "8" }}>
      <Body />
    </Box>
  </Box>
);
