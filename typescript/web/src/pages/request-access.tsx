import { Box } from "@chakra-ui/react";
import * as React from "react";

import { NavBar } from "../components/website/Navbar/NavBar";

import { Footer } from "../components/website/Footer/Footer";
import { RequestAccess } from "../components/website/RequestAccess/RequestAccess";
import { Meta } from "../components/meta";

export default function RequestAccessPage() {
  return (
    <Box minH="640px">
      <Meta title="LabelFlow | Request Access" />
      <NavBar />
      <RequestAccess />
      <Footer />
    </Box>
  );
}
