import { QueryWorkspaceArgs } from "@labelflow/graphql-types";
import { Context, DbWorkspaceWithType } from "@labelflow/common-resolvers";
import { notImplementedInLocalWorkspaceRepository } from "../repository/utils";

const workspace = async (
  _: any,
  args: QueryWorkspaceArgs,
  { repository, user }: Context
): Promise<DbWorkspaceWithType> =>
  (await repository.workspace.get(args.where, user)) as DbWorkspaceWithType;

const workspaces = async (
  _: any,
  _args: QueryWorkspaceArgs,
  { repository }: Context
) => await repository.workspace.list();

const datasets = (_parent: any, _args: any, { repository }: Context) => {
  return repository.dataset.list();
};

export default {
  Query: {
    workspace,
    workspaces,
  },

  Mutation: {
    createWorkspace: notImplementedInLocalWorkspaceRepository,
    updateWorkspace: notImplementedInLocalWorkspaceRepository,
  },
  Workspace: {
    datasets,
    memberships: notImplementedInLocalWorkspaceRepository,
  },
};
