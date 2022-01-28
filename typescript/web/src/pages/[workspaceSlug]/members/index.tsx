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
import {
  GetMembershipsMembersQuery,
  GetMembershipsMembersQueryVariables,
} from "../../../graphql-types/GetMembershipsMembersQuery";

const GET_MEMBERSHIPS_MEMBERS_QUERY = gql`
  query GetMembershipsMembersQuery($workspaceSlug: String) {
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
  mutation DeleteMembershipMutation($id: ID!) {
    deleteMembership(where: { id: $id }) {
      id
    }
  }
`;

const UPDATE_MEMBERSHIP_MUTATION = gql`
  mutation UpdateMembershipMutation($id: ID!, $data: MembershipUpdateInput!) {
    updateMembership(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const INVITE_MEMBER_MUTATION = gql`
  mutation InviteMemberMutation($where: InviteMemberInput!) {
    inviteMember(where: $where)
  }
`;

const WorkspaceMembersPage = () => {
  const workspaceSlug = useRouter().query?.workspaceSlug as string;

  const { data: membershipsData } = useQuery<
    GetMembershipsMembersQuery,
    GetMembershipsMembersQueryVariables
  >(GET_MEMBERSHIPS_MEMBERS_QUERY, {
    variables: { workspaceSlug },
    skip: workspaceSlug == null,
  });

  const [deleteMembership] = useMutation(DELETE_MEMBERSHIP_MUTATION, {
    refetchQueries: [GET_MEMBERSHIPS_MEMBERS_QUERY],
  });

  const [updateMembership] = useMutation(UPDATE_MEMBERSHIP_MUTATION, {
    refetchQueries: [GET_MEMBERSHIPS_MEMBERS_QUERY],
  });

  const [inviteMember] = useMutation(INVITE_MEMBER_MUTATION, {
    refetchQueries: [GET_MEMBERSHIPS_MEMBERS_QUERY],
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
