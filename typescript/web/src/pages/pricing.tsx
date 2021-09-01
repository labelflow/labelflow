import { Box } from "@chakra-ui/react";
import * as React from "react";
import { GetStaticProps } from "next";

import { NavBar } from "../components/website/Navbar/NavBar";

import { Footer } from "../components/website/Footer/Footer";
// import { PricingTable } from "../components/website/Pricing/PricingTable";
import { Meta } from "../components/meta";

export default function Pricing() {
  return (
    <Box minH="640px">
      <Meta title="LabelFlow | Pricing" />
      <NavBar />
      {/* <Hero /> */}
      {/* <PricingTable /> */}
      <Footer />
    </Box>
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
