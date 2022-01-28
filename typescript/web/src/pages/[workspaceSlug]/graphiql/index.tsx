import { Box, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { AuthManager } from "../../../components/auth-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { Layout } from "../../../components/layout";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { NavLogo } from "../../../components/logo/nav-logo";
import { Meta } from "../../../components/meta";
import { LayoutSpinner } from "../../../components/spinner";
import { WelcomeModal } from "../../../components/welcome-manager";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";
import { useWorkspace } from "../../../hooks";

const GraphiQL = dynamic(() => import("../../../components/graphiql"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) throw error;
    return <LayoutSpinner />;
  },
});

const GraphqlPlayground = () => {
  const { workspaceSlug } = useWorkspace();
  return (
    <>
      <WelcomeModal />
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
            <GraphiQL url={`${globalThis.location.origin}/api/graphql`} />
          )}
        </Box>
      </Layout>
    </>
  );
};

export default GraphqlPlayground;
