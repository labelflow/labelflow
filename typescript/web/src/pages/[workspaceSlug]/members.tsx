import { gql, useMutation, useQuery } from "@apollo/client";
import { Text } from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { Authenticated } from "../../components/auth";
import { CookieBanner } from "../../components/cookie-banner";
import { Layout } from "../../components/layout";
import { WorkspaceTabBar } from "../../components/layout/tab-bar/workspace-tab-bar";
import { NavLogo } from "../../components/logo/nav-logo";
import { Members } from "../../components/members";
import { Meta } from "../../components/meta";
import { LayoutSpinner } from "../../components";
import { WorkspaceSwitcher } from "../../components/workspace-switcher";
import {
  GetMembershipsMembersQuery,
  GetMembershipsMembersQueryVariables,
} from "../../graphql-types/GetMembershipsMembersQuery";
import { useWorkspace } from "../../hooks";

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

const LayoutBody = () => {
  const { slug: workspaceSlug } = useWorkspace();

  const { data: membershipsData } = useQuery<
    GetMembershipsMembersQuery,
    GetMembershipsMembersQueryVariables
  >(GET_MEMBERSHIPS_MEMBERS_QUERY, {
    variables: { workspaceSlug },
    skip: isEmpty(workspaceSlug),
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

  return membershipsData?.memberships ? (
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
  );
};

const WorkspaceMembersPage = () => {
  return (
    <Authenticated withWorkspaces>
      <Meta title="LabelFlow | Members" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <Text key={2}>Members</Text>,
        ]}
        tabBar={<WorkspaceTabBar currentTab="members" />}
      >
        <LayoutBody />
      </Layout>
    </Authenticated>
  );
};

export default WorkspaceMembersPage;
