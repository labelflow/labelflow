import { Box, useColorModeValue as mode } from "@chakra-ui/react";
import * as React from "react";

import { NavContent } from "../components/Navbar/NavContent";
import { Hero } from "../components/Hero/Hero";
import { Features } from "../components/Features/Features";
import { LogoGrid } from "../components/Logos/LogoGrid";

import { Why } from "../components/Why/Why";
import { Footer } from "../components/Footer/Footer";
import { Pricing } from "../components/Pricing/Pricing";
import { Meta } from "../components/Meta";

export default function Home() {
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
