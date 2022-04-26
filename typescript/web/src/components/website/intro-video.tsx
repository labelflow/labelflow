import { AspectRatio, Flex, Heading } from "@chakra-ui/react";
import { INTRO_VIDEO_URL } from "./constants";

const Header = () => (
  <Heading size="xl" mb="4" fontWeight="extrabold">
    Get started in 1min 🎥
  </Heading>
);

const Video = () => (
  <Flex direction="column" mt="4" minH="315">
    <AspectRatio ratio={16 / 9} flexGrow={1} maxW="800">
      <iframe
        src={INTRO_VIDEO_URL}
        title="Get started in 1min"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        allowFullScreen
      />
    </AspectRatio>
  </Flex>
);

export const IntroVideo = () => (
  <Flex
    id="movie"
    direction="column"
    as="section"
    px={{ base: "6", lg: "8" }}
    py={{ base: "16", sm: "20" }}
    align={{ base: "stretch", md: "center" }}
  >
    <Flex
      direction="column"
      textAlign="center"
      minW={{ base: undefined, md: "3xl" }}
    >
      <Header />
      <Video />
    </Flex>
  </Flex>
);
