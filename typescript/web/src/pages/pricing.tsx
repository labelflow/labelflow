import { Box } from "@chakra-ui/react";
import * as React from "react";
import { GetStaticProps } from "next";

import { NavBar } from "../components/website/Navbar/NavBar";

import { Footer } from "../components/website/Footer/Footer";
import { Meta } from "../components/meta";
import { CookieBanner } from "../components/cookie-banner";

export default function Pricing() {
  return (
    <>
      <Meta title="LabelFlow | Pricing" />
      <CookieBanner />
      <Box minH="640px">
        <NavBar />
        <Footer />
      </Box>
    </>
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
