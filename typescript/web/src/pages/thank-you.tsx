import { Box } from "@chakra-ui/react";
import * as React from "react";

import { NavBar } from "../components/website/Navbar/NavBar";

import { Survey } from "../components/website/Survey/Survey";
import { Footer } from "../components/website/Footer/Footer";
import { Meta } from "../components/meta";
import { AppLifecycleManager } from "../components/app-lifecycle-manager";

export default function ThankYou() {
  return (
    <>
      <AppLifecycleManager noModals />
      <Meta title="LabelFlow | Thank you" />
      <Box minH="640px">
        <NavBar />
        <Survey />
        <Footer />
      </Box>
    </>
  );
}
