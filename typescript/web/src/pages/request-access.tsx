import * as React from "react";
import { Box } from "@chakra-ui/react";

import { NavBar } from "../components/website/Navbar/NavBar";
import { Footer } from "../components/website/Footer/Footer";
import { RequestAccess } from "../components/website/RequestAccess/RequestAccess";
import { Meta } from "../components/meta";
import { CookieBanner } from "../components/cookie-banner";

export default function RequestAccessPage() {
  return (
    <>
      <Meta title="LabelFlow | Request Access" />
      <CookieBanner />
      <Box minH="640px">
        <NavBar />
        <RequestAccess />
        <Footer />
      </Box>
    </>
  );
}
