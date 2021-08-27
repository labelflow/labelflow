import { Box, useColorModeValue as mode } from "@chakra-ui/react";
import * as React from "react";
import { GetStaticProps } from "next";

import { NavContent } from "../components/website/Navbar/NavContent";

import { Footer } from "../components/website/Footer/Footer";
// import { PricingTable } from "../components/website/Pricing/PricingTable";
import { Meta } from "../components/meta";

export default function Pricing() {
  return (
    <Box minH="640px">
      <Meta title="Labelflow - Pricing" />

      <Box
        as="header"
        bg={mode("white", "gray.800")}
        position="relative"
        zIndex="10"
      >
        <Box
          as="nav"
          aria-label="Main navigation"
          maxW="7xl"
          mx="auto"
          px={{ base: "6", md: "8" }}
        >
          <NavContent.Mobile display={{ base: "flex", lg: "none" }} />
          <NavContent.Desktop display={{ base: "none", lg: "flex" }} />
        </Box>
      </Box>
      {/* <Hero /> */}
      {/* <PricingTable /> */}
      <Footer />
    </Box>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  return {
    redirect: {
      permanent: false,
      destination: "/website#pricing",
    },
  };
};
