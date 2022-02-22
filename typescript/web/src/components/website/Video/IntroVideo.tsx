import { Flex, AspectRatio } from "@chakra-ui/react";
import * as React from "react";

export const IntroVideo = () => (
  <Flex
    direction="column"
    justify="center"
    flexGrow={1}
    mt="4"
    minW={{ base: "full", lg: "1000px" }}
    h={{ base: "auto", lg: "560px" }}
  >
    <AspectRatio ratio={16 / 9}>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/Uxo1KWe-PGQ?playlist=Uxo1KWe-PGQ&loop=1&rel=0&controls=1"
        title="Get started in 1min"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        allowFullScreen
      />
    </AspectRatio>
  </Flex>
);
