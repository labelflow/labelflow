import { notImplementedInLocalWorkspaceRepository } from "../repository/utils";

export default {
  Query: {
    users: notImplementedInLocalWorkspaceRepository,
    user: notImplementedInLocalWorkspaceRepository,
  },
  Mutation: { updateUser: notImplementedInLocalWorkspaceRepository },
  User: { memberships: notImplementedInLocalWorkspaceRepository },
};
