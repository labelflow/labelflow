import { Box } from "@chakra-ui/react";
import * as React from "react";
import { Header } from "./Header";
import { IntroVideo } from "./IntroVideo";

export const Movie = () => {
  return (
    <Box id="movie" as="section">
      <Box
        maxW="2xl"
        mx="auto"
        px={{ base: "6", lg: "8" }}
        py={{ base: "16", sm: "20" }}
        textAlign="center"
      >
        <Header />
        <IntroVideo />
      </Box>
    </Box>
  );
};
