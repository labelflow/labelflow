import { Flex, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { AuthManager } from "../components/auth-manager";
import { CookieBanner } from "../components/cookie-banner";
import { Layout } from "../components/layout";
import { NavLogo } from "../components/logo/nav-logo";
import { Meta } from "../components/meta";
import { ServiceWorkerManagerModal } from "../components/service-worker-manager";
import { LayoutSpinner } from "../components/spinner";
import { WelcomeManager } from "../components/welcome-manager";

const GraphiQL = dynamic(() => import("../components/graphiql"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) throw error;
    return <LayoutSpinner />;
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
        <Flex
          grow={1}
          borderTop="solid 1px"
          borderColor="#d0d0d0"
          boxSizing="border-box"
        >
          {globalThis.location && (
            <GraphiQL url={`${globalThis.location.origin}/api/graphql`} />
          )}
        </Flex>
      </Layout>
    </>
  );
};

export default GraphqlPlayground;
