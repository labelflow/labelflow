import {
  DbWorkspace,
  DbWorkspaceWithType,
  getSlug,
  INVALID_WORKSPACE_NAME_MESSAGES,
  PartialWithNullAllowed,
  Repository,
  validWorkspaceName,
} from "@labelflow/common-resolvers";
import { DEFAULT_WORKSPACE_PLAN } from "@labelflow/common-resolvers/src/constants";
import { WorkspaceType } from "@labelflow/graphql-types";
import { ErrorOverride, withErrorOverridesAsync } from "@labelflow/utils";
import { Prisma, UserRole } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { isNil } from "lodash";
import { getPrismaClient } from "../prisma-client";
import { stripe } from "../utils";
import { checkUserAccessToWorkspace } from "./access-control";
import { castObjectNullsToUndefined } from "./utils";

const addTypeToWorkspace = (
  workspaceWithoutType: DbWorkspace
): DbWorkspaceWithType => ({
  ...workspaceWithoutType,
  type: WorkspaceType.Online,
});

const overrideWorkspaceExistError: ErrorOverride = (error: unknown) => {
  // Try to see if the query failed because another workspace with the same name or slug already exists
  if (
    error instanceof PrismaClientKnownRequestError &&
    // P2002: "Unique constraint failed on the {constraint}"
    error.code === "P2002" &&
    !isNil(error.meta)
  ) {
    const { target = [] } = error.meta as { target?: string[] };
    if (target.includes("name") || target.includes("slug")) {
      throw new Error(INVALID_WORKSPACE_NAME_MESSAGES.workspaceExists);
    }
  }
};

export const addWorkspaceImpl: Repository["workspace"]["add"] = async (
  workspace,
  user
) => {
  if (typeof user?.id !== "string") {
    throw new Error("Couldn't create workspace: No user id");
  }
  const slug = getSlug(workspace.name);
  validWorkspaceName(workspace.name, slug);
  const workspacePlan = workspace.plan ?? DEFAULT_WORKSPACE_PLAN;
  const stripeCustomerId = await stripe.tryCreateCustomer(
    workspace.name,
    slug,
    workspacePlan
  );
  const db = await getPrismaClient();
  const createdWorkspace = await db.workspace.create({
    data: castObjectNullsToUndefined({
      plan: workspacePlan,
      ...workspace,
      slug,
      stripeCustomerId,
      memberships: {
        create: {
          user: { connect: { id: user?.id } },
          role: UserRole.Owner,
        },
      },
    }),
  });
  return createdWorkspace.id;
};

export const addWorkspace = withErrorOverridesAsync(addWorkspaceImpl, [
  overrideWorkspaceExistError,
]);

export const getWorkspace: Repository["workspace"]["get"] = async (
  where,
  user
) => {
  const db = await getPrismaClient();
  const workspaceFromDb = await db.workspace.findUnique({
    where: castObjectNullsToUndefined(where),
  });
  if (isNil(workspaceFromDb) || !isNil(workspaceFromDb.deletedAt)) {
    return undefined;
  }
  await checkUserAccessToWorkspace({
    user,
    where,
  });
  return addTypeToWorkspace(workspaceFromDb);
};

export const listWorkspace: Repository["workspace"]["list"] = async (
  where,
  skip = undefined,
  first = undefined
) => {
  if (isNil(where?.user?.id)) return [];
  const db = await getPrismaClient();
  const workspacesFromDb = await db.workspace.findMany({
    skip: skip ?? undefined,
    take: first ?? undefined,
    orderBy: { createdAt: Prisma.SortOrder.asc },
    where: {
      memberships: { some: { userId: where?.user?.id ?? undefined } },
      slug: where?.slug ?? undefined,
      // Don't list deleted workspaces
      deletedAt: { equals: null },
    },
  });
  return workspacesFromDb.map(addTypeToWorkspace);
};

/**
 * Throws an error if the given where filter has a deletedAt property
 */
const noDeleteUpdate = (
  workspace: PartialWithNullAllowed<DbWorkspaceWithType>
) => {
  const hasDeletedAt = Object.keys(workspace).includes("deletedAt");
  if (hasDeletedAt) {
    throw new Error("Cannot update internal property deletedAt");
  }
};

export const updateWorkspaceImpl: Repository["workspace"]["update"] = async (
  where,
  workspace,
  user
) => {
  noDeleteUpdate(workspace);
  await checkUserAccessToWorkspace({ user, where });
  const newNameAndSlugs =
    typeof workspace.name === "string"
      ? {
          name: workspace.name,
          slug: getSlug(workspace.name),
        }
      : // needed to make prisma happy with the types
        { name: undefined };
  try {
    const db = await getPrismaClient();
    await db.workspace.update({
      where: castObjectNullsToUndefined(where),
      data: castObjectNullsToUndefined({
        ...workspace,
        ...newNameAndSlugs,
        deletedAt: undefined,
      }),
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const updateWorkspace = withErrorOverridesAsync(updateWorkspaceImpl, [
  overrideWorkspaceExistError,
]);

export const deleteWorkspace: Repository["workspace"]["delete"] = async (
  where,
  user
) => {
  const db = await getPrismaClient();
  const data = await getWorkspace(where, user);
  if (isNil(data)) {
    throw new Error("Could not find workspace");
  }
  const { name, slug, stripeCustomerId } = data;
  await db.workspace.update({
    where: castObjectNullsToUndefined(where),
    data: {
      deletedAt: new Date().toISOString(),
      name: `${name}-${data.id}`,
      slug: `${slug}-${data.id}`,
    },
  });
  if (stripeCustomerId) {
    await stripe.tryDeleteCustomer(stripeCustomerId);
  }
};
