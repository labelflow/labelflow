import { gql, useMutation, useQuery } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AuthManager } from "../../../components/auth-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { Layout } from "../../../components/layout";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { NavLogo } from "../../../components/logo/nav-logo";
import { Members } from "../../../components/members";
import { Meta } from "../../../components/meta";
import { LayoutSpinner } from "../../../components/spinner";
import { WelcomeModal } from "../../../components/welcome-manager";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";

const MEMBERSHIPS_QUERY = gql`
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

const DELETE_MEMBERSHIP_MUTATION = gql`
  mutation deleteMembership($id: ID!) {
    deleteMembership(where: { id: $id }) {
      id
    }
  }
`;

const UPDATE_MEMBERSHIP_MUTATION = gql`
  mutation updateMembership($id: ID!, $data: MembershipUpdateInput!) {
    updateMembership(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const INVITE_MEMBER_MUTATION = gql`
  mutation inviteMember($where: InviteMemberInput!) {
    inviteMember(where: $where)
  }
`;

const WorkspaceMembersPage = () => {
  const workspaceSlug = useRouter().query?.workspaceSlug as string;

  const { data: membershipsData } = useQuery(MEMBERSHIPS_QUERY, {
    variables: { workspaceSlug },
    skip: workspaceSlug == null,
  });

  const [deleteMembership] = useMutation(DELETE_MEMBERSHIP_MUTATION, {
    refetchQueries: ["getMembershipsMembers"],
  });

  const [updateMembership] = useMutation(UPDATE_MEMBERSHIP_MUTATION, {
    refetchQueries: ["getMembershipsMembers"],
  });

  const [inviteMember] = useMutation(INVITE_MEMBER_MUTATION, {
    refetchQueries: ["getMembershipsMembers"],
  });

  return (
    <>
      <WelcomeModal />
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
        {membershipsData?.memberships ? (
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
        ) : (
          <LayoutSpinner />
        )}
      </Layout>
    </>
  );
};

export default WorkspaceMembersPage;
