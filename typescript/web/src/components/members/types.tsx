import {
  InvitationResult,
  MembershipRole,
} from "../../graphql-types/globalTypes";

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
}) => Promise<InvitationResult>;

export type RemoveMembership = (id: string) => void;
