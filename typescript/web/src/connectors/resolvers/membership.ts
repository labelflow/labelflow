import { notImplementedInLocalWorkspaceRepository } from "../repository/utils";

export default {
  Query: {
    membership: notImplementedInLocalWorkspaceRepository,
    memberships: notImplementedInLocalWorkspaceRepository,
  },
  Mutation: {
    createMembership: notImplementedInLocalWorkspaceRepository,
    updateMembership: notImplementedInLocalWorkspaceRepository,
    deleteMembership: notImplementedInLocalWorkspaceRepository,
  },
  Membership: {
    user: notImplementedInLocalWorkspaceRepository,
    workspace: notImplementedInLocalWorkspaceRepository,
  },
};
