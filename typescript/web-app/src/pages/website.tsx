import { Box, useColorModeValue as mode } from "@chakra-ui/react";
import * as React from "react";

import { NavContent } from "../components/website/Navbar/NavContent";
import { Hero } from "../components/website/Hero/Hero";
import { Features } from "../components/website/Features/Features";
import { LogoGrid } from "../components/website/Logos/LogoGrid";

import { Why } from "../components/website/Why/Why";
import { Footer } from "../components/website/Footer/Footer";
import { Pricing } from "../components/website/Pricing/Pricing";
import { Meta } from "../components/meta";

export default function Website() {
  return (
    <Box minH="640px">
      <Meta />

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
      <Hero />
      <Features />
      <Why />
      {/* <Testimonials /> */}
      <LogoGrid />
      <Pricing />
      <Footer />
    </Box>
  );
}
