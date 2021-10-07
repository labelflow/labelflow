import { MembershipRole } from "@labelflow/graphql-types";
import { getSession } from "next-auth/react";
import { notImplementedInLocalWorkspaceRepository } from "../repository/utils";
import { localWorkspace } from "../repository/workspace";

export const localMembership = {
  id: "local-membership",
  createdAt: "1970-01-01T00:00:00.000Z",
  updatedAt: "1970-01-01T00:00:00.000Z",
  role: MembershipRole.Admin,
  workspaceSlug: "local",
  userId: "",
};

export default {
  Query: {
    membership: () => localWorkspace,
    memberships: () => [localWorkspace],
  },
  Mutation: {
    createMembership: notImplementedInLocalWorkspaceRepository,
    updateMembership: notImplementedInLocalWorkspaceRepository,
    deleteMembership: notImplementedInLocalWorkspaceRepository,
  },
  Membership: {
    user: async () => {
      const session = await getSession();
      return session?.user ?? { id: "local-user" };
    },
    workspace: () => localWorkspace,
  },
};
