import {
  Box,
  Button,
  Heading,
  LightMode,
  Text,
  Center,
  useTheme,
} from "@chakra-ui/react";
import * as React from "react";

const DISCOVER_WHATS_NEW = "Register Now";

export const Banner = () => {
  const theme = useTheme();

  const color1 = theme?.colors?.brand?.["200"];
  const color2 = theme?.colors?.brand?.["50"];

  return (
    <Box
      id="banner"
      as="section"
      bgGradient={`linear(to-r, ${color1}, ${color2})`}
    >
      <Box>
        <Box
          maxW="2xl"
          mx="auto"
          px={{ base: "6", lg: "8" }}
          py={{ base: "16", sm: "20" }}
          textAlign="center"
        >
          <Heading
            as="h2"
            size="3xl"
            py="6"
            fontWeight="extrabold"
            letterSpacing="tight"
            color="gray.600"
          >
            Webinar
            <br />
          </Heading>

          <Text mt="4" fontSize="lg" color="gray.800">
            <b>
              How to Succeed an Image Labeling Project to Bring your ML Models
              at Scale
            </b>
            <br />
            High volume and quality datasets are some key success factors of a
            machine learning project. In this 30 min webinar, we will share with
            you the best practices to properly run an image labeling project
            (work organisation, type of labels, format, etc.). That will be also
            the opportunity to exchange with you around the future of LabelFlow
            open platform.
            <br />
            <br />
            <b>March 24th, 2022 at 4pm CET</b>
          </Text>

          <Center>
            <Box>
              <LightMode>
                <Button
                  mt="8"
                  as="a"
                  href="https://app.livestorm.co/labelflow/how-to-succeed-an-image-labeling-project-to-bring-your-ml-models-at-scale?type=detailed"
                  target="blank"
                  size="lg"
                  colorScheme="brand"
                  fontWeight="bold"
                >
                  {DISCOVER_WHATS_NEW}
                </Button>
              </LightMode>
            </Box>
          </Center>
        </Box>
      </Box>
    </Box>
  );
};
