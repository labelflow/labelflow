import { Box } from "@chakra-ui/react";
import * as React from "react";

import { NavBar } from "../components/website/Navbar/NavBar";

import { Survey } from "../components/website/Survey/Survey";
import { Footer } from "../components/website/Footer/Footer";
import { Meta } from "../components/meta";
import { ServiceWorkerManagerBackground } from "../components/service-worker-manager";

export default function ThankYou() {
  return (
    <>
      <ServiceWorkerManagerBackground />
      <Meta title="LabelFlow | Thank you" />
      <Box minH="640px">
        <NavBar />
        <Survey />
        <Footer />
      </Box>
    </>
  );
}
