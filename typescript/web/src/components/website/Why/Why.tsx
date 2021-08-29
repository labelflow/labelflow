import { Box, Text, Image, Heading, Button, Center } from "@chakra-ui/react";
import NextLink from "next/link";
import * as React from "react";
import { BsArrowRight } from "react-icons/bs";

// import { Image } from "../Image";

export const Why = () => {
  return (
    <Box
      as="section"
      // bg={mode("gray.50", "gray.800")}
      // bg={mode("white", "gray.900")}
      py="48"
    >
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        <Heading align="center" fontWeight="extrabold" maxW="lg" mx="auto">
          Integrate LabelFlow into your own tech stack
        </Heading>
        <NextLink href="/datasets">
        <Text align="center" textAlign="center" maxW="lg" mx="auto" mt="12">
          <strong>You can get started on Labelflow in a few seconds</strong>, by
          uploading your data in the app.
          <br />
          <br />
          But Labelflow can also connect to your own data stack to stay 100% in
          control of your data and algorithms. Labelflow backend is open-source
          and you can customize it to integrate all your tools around your data
          stack. No duplicate source of truth and complicated scripts to
          synchronize your data between various tools.
        </Text>
        </NextLink>
        <Image
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