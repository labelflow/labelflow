import React from "react";
import dynamic from "next/dynamic";
import { Box, Center, Text } from "@chakra-ui/react";

import { Spinner } from "../components/spinner";
import { Meta } from "../components/meta";
import { Layout } from "../components/layout";
import { ServiceWorkerManagerModal } from "../components/service-worker-manager";
import { WelcomeManager } from "../components/welcome-manager";
import { AuthManager } from "../components/auth-manager";
import { CookieBanner } from "../components/cookie-banner";
import { NavLogo } from "../components/logo/nav-logo";

const GraphiQL = dynamic(() => import("../components/graphiql"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) throw error;
    return (
      <Center h="full">
        <Spinner />
      </Center>
    );
  },
});

const GraphqlPlayground = () => {
  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | GraphiQL" />
      <CookieBanner />
      <Layout
        breadcrumbs={[<NavLogo key={0} />, <Text key={0}>Graphiql</Text>]}
      >
        <Box
          h="100%"
          w="100%"
          borderTop="solid 1px"
          borderColor="#d0d0d0"
          boxSizing="border-box"
        >
          {globalThis.location && (
            <GraphiQL url={`${globalThis.location.origin}/api/graphql`} />
          )}
        </Box>
      </Layout>
    </>
  );
};

export default GraphqlPlayground;
