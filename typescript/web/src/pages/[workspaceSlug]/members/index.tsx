import React from "react";
import { Text, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { ServiceWorkerManagerModal } from "../../../components/service-worker-manager";
import { AuthManager } from "../../../components/auth-manager";
import { WelcomeManager } from "../../../components/welcome-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { Members } from "../../../components/members";

const membershipsQuery = gql`
  query memberships($workspaceSlug: String) {
    memberships(where: { workspaceSlug: $workspaceSlug }) {
      id
      role
      user {
        id
        name
        # email # TODO: add email as optional in the schema so that there are no errors when querying it and there is no email
        image
      }
    }
  }
`;

const MembersPage = () => {
  const workspaceSlug = useRouter().query?.workspaceSlug as string;

  const { data: membershipsData } = useQuery(membershipsQuery, {
    variables: { workspaceSlug },
    skip: workspaceSlug == null,
  });

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Members" />
      <CookieBanner />
      <Layout
        breadcrumbs={[<Text key={0}>Members</Text>]}
        tabBar={
          <WorkspaceTabBar currentTab="members" workspaceSlug={workspaceSlug} />
        }
      >
        <Box p={8}>
          <Members
            memberships={membershipsData?.memberships}
            changeMembershipRole={({ id, role }) => {
              console.log(`Will change membership ${id} to ${role}`);
            }}
            removeMembership={(id) => {
              console.log(`Will remove membership with id ${id}`);
            }}
          />
        </Box>
      </Layout>
    </>
  );
};

export default MembersPage;
