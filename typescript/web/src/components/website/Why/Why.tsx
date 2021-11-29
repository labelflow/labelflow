import { Box, Text, Image, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";

export const Why = () => {
  return (
    <Box as="section" py="48">
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        <Heading align="center" fontWeight="extrabold" maxW="lg" mx="auto">
          Integrate LabelFlow image labeling tool into your own tech stack
        </Heading>
        <NextLink href="/datasets">
          <Text align="center" textAlign="center" maxW="lg" mx="auto" mt="12">
            <strong> You can get started on LabelFlow in a few seconds</strong>,
            by uploading your images in the app to start annotating images right
            away.
            <br />
            <br />
            But LabelFlow can also connect to your own data stack allowing you
            to stay <b> 100% in control of your data and algorithms </b>.
            LabelFlow backend is open-source and you can customize it to
            integrate all your tools around your data stack. No duplicate source
            of truth and complicated scripts to synchronize your data between
            various tools. Managing large datasets for machine learning is now
            made easy.
          </Text>
        </NextLink>
        <Image
          alt="LabelFlow infrastructure diagram"
          mt="12"
          objectFit="cover"
          maxW={{
            base: "calc( 100vw - 48px )",
            sm: "calc( 100vw - 193px )",
            lg: "4xl",
          }}
          mx="auto"
          src="/static/img/home-diagram.png"
        />
      </Box>
    </Box>
  );
};
