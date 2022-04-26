import { Flex, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { Authenticated } from "../components/auth";
import { CookieBanner } from "../components/cookie-banner";
import { Layout } from "../components/layout";
import { NavLogo } from "../components/logo/nav-logo";
import { Meta } from "../components/meta";
import { LayoutSpinner } from "../components";

const GraphiQL = dynamic(() => import("../components/graphiql"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) throw error;
    return <LayoutSpinner />;
  },
});

const GraphqlPlayground = () => (
  <Authenticated>
    <Meta title="LabelFlow | GraphiQL" />
    <CookieBanner />
    <Layout breadcrumbs={[<NavLogo key={0} />, <Text key={0}>Graphiql</Text>]}>
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
  </Authenticated>
);

export default GraphqlPlayground;
