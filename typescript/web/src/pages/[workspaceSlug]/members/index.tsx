import React from "react";
import { Text, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { ServiceWorkerManagerModal } from "../../../components/service-worker-manager";
import { AuthManager } from "../../../components/auth-manager";
import { WelcomeManager } from "../../../components/welcome-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { Members } from "../../../components/members";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";
import { NavLogo } from "../../../components/logo/nav-logo";

const membershipsQuery = gql`
  query getMembershipsMembers($workspaceSlug: String) {
    memberships(where: { workspaceSlug: $workspaceSlug }) {
      id
      role
      status
      invitationEmailSentTo
      user {
        id
        name
        email
        image
      }
      workspace {
        id
        name
        slug
      }
    }
  }
`;

const deleteMembershipMutation = gql`
  mutation deleteMembership($id: ID!) {
    deleteMembership(where: { id: $id }) {
      id
    }
  }
`;

const updateMembershipMutation = gql`
  mutation updateMembership($id: ID!, $data: MembershipUpdateInput!) {
    updateMembership(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const inviteMemberMutation = gql`
  mutation inviteMember($where: InviteMemberInput!) {
    inviteMember(where: $where)
  }
`;

const WorkspaceMembersPage = () => {
  const workspaceSlug = useRouter().query?.workspaceSlug as string;

  const { data: membershipsData } = useQuery(membershipsQuery, {
    variables: { workspaceSlug },
    skip: workspaceSlug == null,
  });

  const [deleteMembership] = useMutation(deleteMembershipMutation, {
    refetchQueries: ["getMembershipsMembers"],
  });

  const [updateMembership] = useMutation(updateMembershipMutation, {
    refetchQueries: ["getMembershipsMembers"],
  });

  const [inviteMember] = useMutation(inviteMemberMutation, {
    refetchQueries: ["getMembershipsMembers"],
  });

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Members" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <Text key={2}>Members</Text>,
        ]}
        tabBar={
          <WorkspaceTabBar currentTab="members" workspaceSlug={workspaceSlug} />
        }
      >
        <Box p={8}>
          <Members
            memberships={membershipsData?.memberships ?? []}
            changeMembershipRole={({ id, role }) => {
              updateMembership({ variables: { id, data: { role } } });
            }}
            removeMembership={(id) => {
              deleteMembership({ variables: { id } });
            }}
            inviteMember={async (where) => {
              const {
                data: { inviteMember: invitationResult },
              } = await inviteMember({ variables: { where } });
              return invitationResult;
            }}
          />
        </Box>
      </Layout>
    </>
  );
};

export default WorkspaceMembersPage;
