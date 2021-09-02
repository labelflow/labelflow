import { Box } from "@chakra-ui/react";
import * as React from "react";

import { NavBar } from "../components/website/Navbar/NavBar";

import { Footer } from "../components/website/Footer/Footer";
import { RequestAccess } from "../components/website/RequestAccess/RequestAccess";
import { Meta } from "../components/meta";
import { AppLifecycleManager } from "../components/app-lifecycle-manager";

export default function RequestAccessPage() {
  return (
    <>
      <AppLifecycleManager noModals />
      <Meta title="LabelFlow | Request Access" />
      <Box minH="640px">
        <NavBar />
        <RequestAccess />
        <Footer />
      </Box>
    </>
  );
}
