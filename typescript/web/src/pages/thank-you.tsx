import { Box } from "@chakra-ui/react";
import * as React from "react";

import { NavBar } from "../components/website/Navbar/NavBar";

import { Survey } from "../components/website/Survey/Survey";
import { Footer } from "../components/website/Footer/Footer";
import { Meta } from "../components/meta";

export default function ThankYou() {
  return (
    <Box minH="640px">
      <Meta title="LabelFlow | Thank you" />
      <NavBar />
      <Survey />
      <Footer />
    </Box>
  );
}
