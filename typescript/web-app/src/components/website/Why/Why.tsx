import { Box, Text, Image, Heading } from "@chakra-ui/react";
import * as React from "react";

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
          The open command center that fits in your own stack
        </Heading>
        <Text align="center" textAlign="center" maxW="lg" mx="auto" mt="12">
          <strong>You can get started on Labelflow in a few seconds</strong>, by
          uploading your data in the app and using our hosted offering.
          <br />
          <br />
          But Labelflow can also connect to your own data stack. This allows you
          to stay 100% in control of your data and algorithms. Labelflow backend
          is open-source and you can customize it to integrate all your tools
          around <strong>your data stack</strong>. No duplicate source of truth
          and complicated scripts to synchronize your data between various
          tools.
        </Text>
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
        {/* <Image
          // mt="24"
          // height="xl"
          width={720}
          height={280}
          // w="auto"
          // h="auto"
          layout="intrinsic"
          // objectFit="contain"
          // maxW={{ base: "calc( 100vw - 48px )", md: "xl" }}
          // mx="auto"
          src="/static/img/home-diagram.png"
        /> */}
      </Box>
    </Box>
  );
};
