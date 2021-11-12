import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";

import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { ServiceWorkerManagerModal } from "../../../components/service-worker-manager";
import { WelcomeManager } from "../../../components/welcome-manager";
import { AuthManager } from "../../../components/auth-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { NavLogo } from "../../../components/logo/nav-logo";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";

const GraphiQL = dynamic(() => import("../../../components/graphiql"), {
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
  const workspaceSlug = useRouter().query?.workspaceSlug as string;

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | GraphiQL" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <Text key={2}>Graphiql</Text>,
        ]}
        tabBar={
          <WorkspaceTabBar
            currentTab="graphiql"
            workspaceSlug={workspaceSlug}
          />
        }
      >
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
                workspaceSlug === "local"
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
