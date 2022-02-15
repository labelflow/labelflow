import { Box } from "@chakra-ui/react";
import * as React from "react";

import { NavBar } from "../components/website/Navbar/NavBar";

import { Survey } from "../components/website/Survey/Survey";
import { Footer } from "../components/website/Footer/Footer";
import { Meta } from "../components/meta";
import { CookieBanner } from "../components/cookie-banner";

export default function ThankYou() {
  return (
    <>
      <Meta title="LabelFlow | Thank you" />
      <CookieBanner />
      <Box minH="640px">
        <NavBar />
        <Survey />
        <Footer />
      </Box>
    </>
  );
}
