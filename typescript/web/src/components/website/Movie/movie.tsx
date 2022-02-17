import { Box, Heading, Flex, Center, AspectRatio } from "@chakra-ui/react";
import * as React from "react";

export const Movie = () => {
  return (
    <Box id="Movie" as="section">
      <Box>
        <Box
          maxW="2xl"
          mx="auto"
          px={{ base: "6", lg: "8" }}
          py={{ base: "16", sm: "20" }}
          textAlign="center"
        >
          <Heading size="xl" mb="4" fontWeight="extrabold">
            1 min product video tour to get you started
          </Heading>

          <Center>
            <Flex
              direction="column"
              justify="center"
              flexGrow={1}
              mt="4"
              pos="relative"
              minW={{ base: "full", lg: "1000px" }}
              h={{ base: "auto", lg: "560px" }}
            >
              <AspectRatio ratio={16 / 9}>
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/Uxo1KWe-PGQ?playlist=Uxo1KWe-PGQ&loop=1&rel=0&controls=1"
                  title="1 min LabelFlow Intro Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  frameBorder="0"
                  allowFullScreen
                />
              </AspectRatio>
            </Flex>
          </Center>
        </Box>
      </Box>
    </Box>
  );
};
