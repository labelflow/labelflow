import { Prisma, WorkspacePlan, UserRole } from "@prisma/client";
import {
  DbWorkspace,
  DbWorkspaceWithType,
  Repository,
} from "@labelflow/common-resolvers";
import { WorkspaceType } from "@labelflow/graphql-types";
import slugify from "slugify";
import { prisma } from "./prisma-client";
import { castObjectNullsToUndefined } from "./utils";
import { checkUserAccessToWorkspace } from "./access-control";

const addTypeToWorkspace = (
  workspaceWithoutType: DbWorkspace
): DbWorkspaceWithType => ({
  ...workspaceWithoutType,
  type: WorkspaceType.Online,
});

export const addWorkspace: Repository["workspace"]["add"] = async (
  workspace,
  user
) => {
  if (typeof user?.id !== "string") {
    throw new Error("Couldn't create workspace: No user id");
  }
  const slug = slugify(workspace.name, { lower: true });
  const plan = WorkspacePlan.Community;
  const createdWorkspace = await prisma.workspace.create({
    data: castObjectNullsToUndefined({
      slug,
      plan,
      ...workspace,
      memberships: {
        create: {
          userId: user?.id,
          role: UserRole.Owner,
        },
      },
    }),
  });
  return createdWorkspace.id;
};

export const getWorkspace: Repository["workspace"]["get"] = async (
  where,
  user
) => {
  const workspaceFromDb = await prisma.workspace.findUnique({
    where: castObjectNullsToUndefined(where),
  });
  if (workspaceFromDb != null) {
    await checkUserAccessToWorkspace({
      user,
      where,
    });
    return addTypeToWorkspace(workspaceFromDb);
  }
  return workspaceFromDb;
};

export const listWorkspace: Repository["workspace"]["list"] = async (
  where,
  skip = undefined,
  first = undefined
) => {
  if (where?.user?.id == null) {
    return [];
  }
  const workspacesFromDb = await prisma.workspace.findMany(
    castObjectNullsToUndefined({
      skip: skip ?? undefined,
      take: first ?? undefined,
      orderBy: { createdAt: Prisma.SortOrder.asc },
      where: { memberships: { some: { userId: where?.user?.id } } },
    })
  );
  return workspacesFromDb.map(addTypeToWorkspace);
};

export const updateWorkspace: Repository["workspace"]["update"] = async (
  where,
  workspace,
  user
) => {
  // Check if user has access to workspace, this will throw it it does not
  await checkUserAccessToWorkspace({ user, where });
  // Update workspace
  const newNameAndSlugs =
    typeof workspace.name === "string"
      ? {
          name: workspace.name,
          slug: slugify(workspace.name, { lower: true }),
        }
      : // needed to make prisma happy with the types
        { name: undefined };
  try {
    await prisma.workspace.update({
      where: castObjectNullsToUndefined(where),
      data: castObjectNullsToUndefined({
        ...workspace,
        ...newNameAndSlugs,
      }),
    });
    return true;
  } catch (e) {
    return false;
  }
};
