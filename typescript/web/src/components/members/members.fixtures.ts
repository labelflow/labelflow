import {
  GetMembershipsMembersQuery_memberships,
  GetMembershipsMembersQuery_memberships_user,
} from "../../graphql-types/GetMembershipsMembersQuery";
import {
  MembershipRole,
  MembershipStatus,
} from "../../graphql-types/globalTypes";

export const TEST_MEMBERSHIPS_USER_1: GetMembershipsMembersQuery_memberships_user =
  {
    id: "user1",
    image:
      "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDN8fGd1eSUyMGZhY2V8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
    name: "Marion Watson",
    email: "codyfisher@example.com",
  };

export const TEST_MEMBERSHIPS_USER_2: GetMembershipsMembersQuery_memberships_user =
  {
    id: "user2",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
    name: "Louise Hopkins",
    email: "jane@example.com",
  };

export const TEST_MEMBERSHIPS_USER_3: GetMembershipsMembersQuery_memberships_user =
  {
    id: "1234567890",
    image:
      "https://images.unsplash.com/photo-1533674689012-136b487b7736?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mjl8fGFmcmljYSUyMGxhZHklMjBmYWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
    name: null,
    email: null,
  };

export const TEST_MEMBERSHIPS: GetMembershipsMembersQuery_memberships[] = [
  {
    role: MembershipRole.Admin,
    status: MembershipStatus.Active,
    id: "membership1",
    user: TEST_MEMBERSHIPS_USER_1,
    invitationEmailSentTo: TEST_MEMBERSHIPS_USER_1.email,
    workspace: {
      slug: "",
      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    role: MembershipRole.Owner,
    status: MembershipStatus.Active,
    id: "membership2",
    user: TEST_MEMBERSHIPS_USER_2,
    invitationEmailSentTo: TEST_MEMBERSHIPS_USER_2.email,
    workspace: {
      slug: "",
      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    role: MembershipRole.Admin,
    status: MembershipStatus.Declined,
    id: "membership3",
    invitationEmailSentTo: "blabla@toto.com",
    workspace: {
      slug: "",
      id: "ws-1",
      name: "My workspace",
    },
    user: null,
  },
  {
    role: MembershipRole.Owner,
    status: MembershipStatus.Active,
    id: "membership4",
    user: TEST_MEMBERSHIPS_USER_3,
    invitationEmailSentTo: TEST_MEMBERSHIPS_USER_3.email,
    workspace: {
      slug: "",
      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    role: MembershipRole.Admin,
    status: MembershipStatus.Sent,
    id: "membership5",
    invitationEmailSentTo: "member5@gmail.com",
    workspace: {
      slug: "",
      id: "ws-1",
      name: "My workspace",
    },
    user: null,
  },
];
