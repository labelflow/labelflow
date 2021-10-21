import { MembershipRole, InvitationStatus } from "@labelflow/graphql-types";

export type ChangeMembershipRole = ({
  id,
  role,
}: {
  id: string;
  role: MembershipRole;
}) => void;

export type InviteMember = ({
  role,
  email,
  workspaceSlug,
}: {
  role: MembershipRole;
  email: string;
  workspaceSlug: string;
}) => Promise<InvitationStatus>;

export type RemoveMembership = (id: string) => void;
// export type Membership = {
//   id: string;
//   role: "Owner" | "Admin" | "Member";
//   invitationEmailSentTo?: string;
//   invitationToken?: string;
//   user?: {
//     id?: string;
//     name?: string;
//     email?: string;
//     image?: string;
//   };
//   workspace: {
//     id: string;
//     name: string;
//   };
// };
