import slugify from "slugify";
import { Prisma } from "@prisma/client";

import {
  QueryWorkspaceArgs,
  QueryWorkspacesArgs,
  WorkspaceType,
  WorkspacePlan,
  Workspace,
  Membership,
  MutationCreateWorkspaceArgs,
  MutationUpdateWorkspaceArgs,
  WorkspaceWhereUniqueInput,
} from "@labelflow/graphql-types";

import { Context } from "@labelflow/common-resolvers";
import { prisma } from "../repository";
import { castObjectNullsToUndefined } from "../repository/utils";

type DbWorkspacePlan = NonNullable<
  Prisma.PromiseReturnType<typeof prisma.workspace.findUnique>
>["plan"];

type DbWorkspace = Omit<
  Workspace,
  "__typename" | "type" | "datasets" | "memberships" | "plan"
> & { plan: DbWorkspacePlan };

type DbWorkspaceWithType = DbWorkspace & { type: WorkspaceType };

const addTypeToWorkspace = (
  workspaceWithoutType: Omit<DbWorkspace, "type">
): DbWorkspaceWithType => ({
  ...workspaceWithoutType,
  type: WorkspaceType.Online,
});

export const getWorkspace = async (
  where: WorkspaceWhereUniqueInput,
  user: { id: string } | undefined
): Promise<DbWorkspace> => {
  const workspacesFromDb = await prisma.workspace.findMany({
    where: castObjectNullsToUndefined({
      ...where,
      memberships: { some: { userId: user?.id } },
    }),
  });
  const workspaceFromDb = workspacesFromDb?.[0] ?? null;
  if (workspaceFromDb == null || user == null) {
    throw new Error(`Couldn't find a workspace with id: "${where.id}"`);
  }
  return workspaceFromDb;
};

const workspace = async (
  _: any,
  args: QueryWorkspaceArgs,
  { user }: Context
): Promise<DbWorkspaceWithType> => {
  const workspaceFromDb = await getWorkspace(args.where, user);
  return addTypeToWorkspace(workspaceFromDb);
};

const workspaces = async (
  _: any,
  args: QueryWorkspacesArgs,
  { user }: Context
): Promise<DbWorkspaceWithType[]> => {
  const workspacesFromDb = await prisma.workspace.findMany({
    skip: args.skip ?? undefined,
    take: args.first ?? undefined,
    orderBy: { createdAt: Prisma.SortOrder.asc },
    where: { memberships: { some: { userId: user?.id } } },
  });

  return workspacesFromDb.map(addTypeToWorkspace);
};

const createWorkspace = async (
  _: any,
  args: MutationCreateWorkspaceArgs,
  { user }: Context
): Promise<DbWorkspaceWithType> => {
  if (typeof user?.id !== "string") {
    throw new Error("Couldn't create workspace: No user id");
  }
  const userInDb = await prisma.user.findUnique({ where: { id: user.id } });

  if (userInDb == null) {
    throw new Error(
      `Couldn't create workspace: User with id "${user.id}" doesn't exist in the database`
    );
  }

  const createdWorkspace = await prisma.workspace.create({
    data: {
      id: args.data.id ?? undefined,
      name: args.data.name,
      slug: slugify(args.data.name, { lower: true }),
      plan: WorkspacePlan.Community,
      memberships: { create: { userId: user?.id, role: "Admin" } },
    },
  });

  return addTypeToWorkspace(createdWorkspace);
};

const updateWorkspace = async (
  _: any,
  args: MutationUpdateWorkspaceArgs
): Promise<DbWorkspaceWithType> => {
  const newNameAndSlugs =
    typeof args.data.name === "string"
      ? {
          name: args.data.name,
          slug: slugify(args.data.name, { lower: true }),
        }
      : // needed to make prisma happy with the types
        { name: undefined };

  const updatedWorkspace = await prisma.workspace.update({
    where: castObjectNullsToUndefined(args.where),
    data: { ...args.data, ...newNameAndSlugs },
  });

  return addTypeToWorkspace(updatedWorkspace);
};

const memberships = async (parent: Workspace) => {
  return (await prisma.membership.findMany({
    where: { workspaceSlug: parent.slug },
    orderBy: { createdAt: Prisma.SortOrder.asc },
    // needs to be casted to avoid conflicts between enums
  })) as Omit<Membership, "user" | "workspace">[];
};

const datasets = async (parent: Workspace) => {
  return await prisma.dataset.findMany({
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