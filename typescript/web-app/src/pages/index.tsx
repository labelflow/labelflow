import React from "react";
import { Layout } from "../components/layout";
import { WelcomeModal } from "../components/welcome-modal";

const IndexPage = () => {
  return (
    <Layout>
      <WelcomeModal />
    </Layout>
  );
};

export default IndexPage;
