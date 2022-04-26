import { gql, useQuery } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { GetServerSideProps } from "next";
import React from "react";
import { Authenticated } from "../../components/auth";
import { CookieBanner } from "../../components/cookie-banner";
import { Layout } from "../../components/layout";
import { WorkspaceTabBar } from "../../components/layout/tab-bar/workspace-tab-bar";
import { NavLogo } from "../../components/logo/nav-logo";
import { Meta } from "../../components/meta";
import { WorkspaceSettings } from "../../components/settings/workspace";
import { LayoutSpinner } from "../../components";
import { WorkspaceSwitcher } from "../../components/workspace-switcher";
import {
  GetWorkspaceDetailsQuery,
  GetWorkspaceDetailsQueryVariables,
} from "../../graphql-types";
import { useWorkspace } from "../../hooks";

const GET_WORKSPACE_DETAILS_QUERY = gql`
  query GetWorkspaceDetailsQuery($workspaceSlug: String) {
    workspace(where: { slug: $workspaceSlug }) {
      id
      plan
      slug
      image
      name
      stripeCustomerPortalUrl
      imagesAggregates {
        totalCount
      }
    }
  }
`;

const Body = () => {
  const { slug: workspaceSlug } = useWorkspace();

  const {
    data: getWorkspaceDetailsData,
    previousData: getWorkspaceDetailsPreviousData,
  } = useQuery<GetWorkspaceDetailsQuery, GetWorkspaceDetailsQueryVariables>(
    GET_WORKSPACE_DETAILS_QUERY,
    {
      variables: { workspaceSlug },
      skip: isEmpty(workspaceSlug),
      pollInterval: 1000 * 60 * 5,
    }
  );

  const getWorkspaceDetailsFinalData =
    getWorkspaceDetailsData?.workspace ??
    getWorkspaceDetailsPreviousData?.workspace;

  return (
    <>
      <Meta title="LabelFlow | Workspace Settings" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <Text key={2}>Settings</Text>,
        ]}
        tabBar={<WorkspaceTabBar currentTab="settings" />}
      >
        {getWorkspaceDetailsFinalData ? (
          <Box p={8}>
            <WorkspaceSettings workspace={getWorkspaceDetailsFinalData} />
          </Box>
        ) : (
          <LayoutSpinner />
        )}
      </Layout>
    </>
  );
};

const WorkspaceSettingsPage = () => (
  <Authenticated withWorkspaces>
    <Body />
  </Authenticated>
);

export default WorkspaceSettingsPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (query?.workspaceSlug === "local") {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
