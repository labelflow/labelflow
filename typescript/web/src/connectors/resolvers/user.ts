import { notImplementedInLocalWorkspaceResolver } from "./utils";

export default {
  Query: {
    users: notImplementedInLocalWorkspaceResolver,
    user: notImplementedInLocalWorkspaceResolver,
  },
  Mutation: { updateUser: notImplementedInLocalWorkspaceResolver },
  User: { memberships: notImplementedInLocalWorkspaceResolver },
};
