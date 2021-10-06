import { MembershipRole } from "@labelflow/graphql-types";

export type Role = keyof typeof MembershipRole;
export type ChangeMembershipRole = ({
  id,
  role,
}: {
  id: string;
  role: Role;
}) => void;
export type RemoveMembership = (id: string) => void;
export type Membership = {
  id: string;
  role: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
};
