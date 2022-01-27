import {
  CurrentUserCanAcceptInvitation,
  Membership,
  MembershipRole,
  MembershipStatus,
  WorkspacePlan,
  WorkspaceType,
} from "@labelflow/graphql-types";
import { SessionProvider } from "next-auth/react";
import { Members } from "..";
import {
  apolloMockDecorator,
  chakraDecorator,
  storybookTitle,
} from "../../../utils/stories";

export default {
  title: storybookTitle(Members),
  component: Members,
  decorators: [chakraDecorator, apolloMockDecorator],
};

const memberships: Membership[] = [
  {
    role: MembershipRole.Admin,
    status: MembershipStatus.Active,
    currentUserCanAcceptInvitation: CurrentUserCanAcceptInvitation.Yes,
    id: "membership1",
    createdAt: "",
    updatedAt: "",
    user: {
      createdAt: "",
      updatedAt: "",
      memberships: [],
      id: "user1",
      image:
        "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDN8fGd1eSUyMGZhY2V8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
      name: "Marion Watson",
      email: "codyfisher@example.com",
    },
    workspace: {
      datasets: [],
      memberships: [],
      plan: WorkspacePlan.Community,
      createdAt: "",
      updatedAt: "",
      slug: "",
      type: WorkspaceType.Online,
      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    role: MembershipRole.Owner,
    status: MembershipStatus.Active,
    currentUserCanAcceptInvitation: CurrentUserCanAcceptInvitation.Yes,
    id: "membership2",
    createdAt: "",
    updatedAt: "",
    user: {
      createdAt: "",
      updatedAt: "",
      memberships: [],
      id: "user2",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      name: "Louise Hopkins",
      email: "jane@example.com",
    },
    workspace: {
      datasets: [],
      memberships: [],
      plan: WorkspacePlan.Community,
      createdAt: "",
      updatedAt: "",
      slug: "",
      type: WorkspaceType.Online,
      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    createdAt: "",
    updatedAt: "",
    role: MembershipRole.Admin,
    status: MembershipStatus.Declined,
    currentUserCanAcceptInvitation: CurrentUserCanAcceptInvitation.Yes,
    id: "membership3",
    invitationEmailSentTo: "blabla@toto.com",
    workspace: {
      datasets: [],
      memberships: [],
      plan: WorkspacePlan.Community,
      createdAt: "",
      updatedAt: "",
      slug: "",
      type: WorkspaceType.Online,
      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    role: MembershipRole.Owner,
    status: MembershipStatus.Active,
    currentUserCanAcceptInvitation: CurrentUserCanAcceptInvitation.Yes,
    id: "membership4",
    createdAt: "",
    updatedAt: "",
    user: {
      createdAt: "",
      updatedAt: "",
      memberships: [],
      id: "1234567890",
      image:
        "https://images.unsplash.com/photo-1533674689012-136b487b7736?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mjl8fGFmcmljYSUyMGxhZHklMjBmYWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
    },
    workspace: {
      datasets: [],
      memberships: [],
      plan: WorkspacePlan.Community,
      createdAt: "",
      updatedAt: "",
      slug: "",
      type: WorkspaceType.Online,
      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    createdAt: "",
    updatedAt: "",
    role: MembershipRole.Admin,
    status: MembershipStatus.Sent,
    currentUserCanAcceptInvitation: CurrentUserCanAcceptInvitation.Yes,
    id: "membership5",
    invitationEmailSentTo: "member5@gmail.com",
    workspace: {
      datasets: [],
      memberships: [],
      plan: WorkspacePlan.Community,
      createdAt: "",
      updatedAt: "",
      slug: "",
      type: WorkspaceType.Online,
      id: "ws-1",
      name: "My workspace",
    },
  },
];

export const MembersList = () => {
  return (
    <SessionProvider session={undefined}>
      <Members
        memberships={memberships}
        changeMembershipRole={({ id, role }) => {
          console.log(`Will change membership ${id} to ${role}`);
        }}
        removeMembership={(id) => {
          console.log(`Will remove membership with id ${id}`);
        }}
      />
    </SessionProvider>
  );
};

MembersList.parameters = {
  nextRouter: {
    query: {
      workspaceSlug: "local",
    },
  },
};
