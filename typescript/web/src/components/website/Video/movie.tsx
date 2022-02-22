import { Flex } from "@chakra-ui/react";
import * as React from "react";
import { Header } from "./header";
import { IntroVideo } from "./intro-video";

export const Movie = () => (
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
      <IntroVideo />
    </Flex>
  </Flex>
);
