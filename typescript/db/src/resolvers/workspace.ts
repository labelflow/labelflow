import { Prisma } from "@prisma/client";

import {
  QueryWorkspaceArgs,
  QueryWorkspacesArgs,
  Workspace,
  Membership,
  MutationCreateWorkspaceArgs,
  MutationUpdateWorkspaceArgs,
  WorkspaceWhereUniqueInput,
} from "@labelflow/graphql-types";

import {
  Context,
  DbWorkspaceWithType,
  Repository,
} from "@labelflow/common-resolvers";
import { getPrismaClient } from "../prisma-client";
import { castObjectNullsToUndefined } from "../repository/utils";

const getWorkspace = async (
  where: WorkspaceWhereUniqueInput,
  repository: Repository,
  user?: { id: string }
): Promise<DbWorkspaceWithType & { __typename: "Workspace" }> => {
  const workspaceFromDb = await repository.workspace.get(where, user);
  if (workspaceFromDb == null) {
    throw new Error(
      `Couldn't find workspace from input "${JSON.stringify(where)}"`
    );
  }
  return { ...workspaceFromDb, __typename: "Workspace" };
};

const workspace = async (
  _: any,
  args: QueryWorkspaceArgs,
  { repository, user }: Context
): Promise<DbWorkspaceWithType> =>
  await getWorkspace(args.where, repository, user);

const workspaces = async (
  _: any,
  args: QueryWorkspacesArgs,
  { repository, user }: Context
): Promise<DbWorkspaceWithType[]> =>
  await repository.workspace.list({ user }, args.skip, args.first);

const createWorkspace = async (
  _: any,
  args: MutationCreateWorkspaceArgs,
  { repository, user }: Context
): Promise<DbWorkspaceWithType> => {
  if (typeof user?.id !== "string") {
    throw new Error("Couldn't create workspace: No user id");
  }
  const userInDb = await (
    await getPrismaClient()
  ).user.findUnique({ where: { id: user.id } });

  if (userInDb == null) {
    throw new Error(
      `Couldn't create workspace: User with id "${user.id}" doesn't exist in the database`
    );
  }

  const createdWorkspaceId = await repository.workspace.add(
    {
      id: args.data.id ?? undefined,
      name: args.data.name,
    },
    user
  );

  return await getWorkspace({ id: createdWorkspaceId }, repository, user);
};

const updateWorkspace = async (
  _: any,
  args: MutationUpdateWorkspaceArgs,
  { repository, user }: Context
): Promise<DbWorkspaceWithType> => {
  // Update workspace
  await repository.workspace.update(
    castObjectNullsToUndefined(args.where),
    { ...args.data },
    user
  );

  return await getWorkspace(args.where, repository, user);
};

const memberships = async (parent: Workspace) => {
  return (await (
    await getPrismaClient()
  ).membership.findMany({
    where: { workspaceSlug: parent.slug },
    orderBy: { createdAt: Prisma.SortOrder.asc },
    // needs to be casted to avoid conflicts between enums
  })) as Omit<Membership, "user" | "workspace">[];
};

const datasets = async (parent: Workspace) => {
  return await (
    await getPrismaClient()
  ).dataset.findMany({
    where: { workspaceSlug: parent.slug },
    orderBy: { createdAt: Prisma.SortOrder.asc },
  });
};

export default {
  Query: {
    workspace,
    workspaces,
  },
  Mutation: { createWorkspace, updateWorkspace },
  Workspace: { memberships, datasets },
};
