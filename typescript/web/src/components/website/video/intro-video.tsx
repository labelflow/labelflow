import { Flex, AspectRatio } from "@chakra-ui/react";

export const IntroVideo = () => (
  <Flex direction="column" mt="4" minH="315">
    <AspectRatio ratio={16 / 9} flexGrow={1} maxW="800">
      <iframe
        src="https://www.youtube.com/embed/Uxo1KWe-PGQ?playlist=Uxo1KWe-PGQ&loop=1&rel=0&controls=1"
        title="Get started in 1min"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        allowFullScreen
      />
    </AspectRatio>
  </Flex>
);
