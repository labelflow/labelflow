import React from "react";
import dynamic from "next/dynamic";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";

import { Meta } from "../../components/meta";
import { Layout } from "../../components/layout";
import { ServiceWorkerManagerModal } from "../../components/service-worker-manager";
import { WelcomeManager } from "../../components/welcome-manager";
import { AuthManager } from "../../components/auth-manager";
import { CookieBanner } from "../../components/cookie-banner";

const GraphiQL = dynamic(() => import("../../components/graphiql"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) throw error;
    return (
      <Center h="full">
        <Spinner size="xl" />
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
      <Layout breadcrumbs={[<Text>Graphiql</Text>]}>
        <Box
          h="100%"
          w="100%"
          borderTop="solid 1px"
          borderColor="#d0d0d0"
          boxSizing="border-box"
        >
          {globalThis.location && (
            <GraphiQL
              url={
                globalThis?.location?.pathname?.startsWith("/local")
                  ? `${globalThis.location.origin}/api/worker/graphql`
                  : `${globalThis.location.origin}/api/graphql`
              }
            />
          )}
        </Box>
      </Layout>
    </>
  );
};

export default GraphqlPlayground;
