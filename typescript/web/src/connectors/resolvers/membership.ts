import { notImplementedInLocalWorkspaceResolver } from "./utils";

export default {
  Query: {
    membership: notImplementedInLocalWorkspaceResolver,
    memberships: notImplementedInLocalWorkspaceResolver,
  },
  Mutation: {
    createMembership: notImplementedInLocalWorkspaceResolver,
    updateMembership: notImplementedInLocalWorkspaceResolver,
    deleteMembership: notImplementedInLocalWorkspaceResolver,
  },
  Membership: {
    user: notImplementedInLocalWorkspaceResolver,
    workspace: notImplementedInLocalWorkspaceResolver,
  },
};
