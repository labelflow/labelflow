import {
  QueryWorkspaceArgs,
  QueryWorkspacesArgs,
} from "@labelflow/graphql-types";
import {
  addTypenames,
  Context,
  DbWorkspaceWithType,
} from "@labelflow/common-resolvers";
import { notImplementedInLocalWorkspaceRepository } from "../repository/utils";
import { localWorkspace } from "../repository/workspace";

const workspace = async (
  _: any,
  args: QueryWorkspaceArgs,
  { repository, user }: Context
): Promise<DbWorkspaceWithType> =>
  (await repository.workspace.get(args.where, user)) as DbWorkspaceWithType;

const workspaces = async (
  _: any,
  args: QueryWorkspacesArgs,
  { repository }: Context
) => await repository.workspace.list(args.where);

const datasets = async (
  _parent: never,
  _args: never,
  { repository }: Context
) => {
  const queryResult = await repository.dataset.list();
  return addTypenames(queryResult, "Dataset");
};

export default {
  Query: {
    workspace,
    workspaces,
    workspaceExists: notImplementedInLocalWorkspaceRepository,
  },

  Mutation: {
    createWorkspace: notImplementedInLocalWorkspaceRepository,
    updateWorkspace: notImplementedInLocalWorkspaceRepository,
  },
  Workspace: {
    datasets,
    memberships: () => [localWorkspace],
  },
};
