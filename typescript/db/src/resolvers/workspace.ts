import {
  addTypename,
  addTypenames,
  Context,
  DbWorkspace,
  DbWorkspaceWithType,
  Repository,
} from "@labelflow/common-resolvers";
import {
  Membership,
  MembershipRole,
  MutationCreateWorkspaceArgs,
  MutationDeleteWorkspaceArgs,
  MutationUpdateWorkspaceArgs,
  QueryWorkspaceArgs,
  QueryWorkspacesArgs,
  WorkspaceWhereUniqueInput,
} from "@labelflow/graphql-types";
import { Prisma } from "@prisma/client";
import { isNil } from "lodash/fp";
import { getPrismaClient } from "../prisma-client";
import { AuthorizationError } from "../repository/authorization-error";
import { castObjectNullsToUndefined } from "../repository/utils";
import { stripe } from "../utils";
import { createTutorialDataset } from "../utils/tutorial";

function foundWorkspace<TData extends DbWorkspaceWithType | DbWorkspace>(
  data: TData | null | undefined,
  input: WorkspaceWhereUniqueInput
): asserts data is NonNullable<TData> {
  if (isNil(data)) {
    const msg = `Couldn't find workspace from input "${JSON.stringify(input)}"`;
    throw new Error(msg);
  }
}

const getWorkspace = async (
  where: WorkspaceWhereUniqueInput,
  repository: Repository,
  user?: { id: string }
): Promise<DbWorkspaceWithType & { __typename: "Workspace" }> => {
  const data = await repository.workspace.get(where, user);
  foundWorkspace(data, where);
  return addTypename(data, "Workspace");
};

const workspace = async (
  _: any,
  args: QueryWorkspaceArgs,
  { repository, user }: Context
): Promise<DbWorkspaceWithType> =>
  await getWorkspace(args.where, repository, user);

const workspaceExists = async (
  _: any,
  args: QueryWorkspaceArgs,
  { repository, user }: Context
): Promise<boolean> => {
  try {
    const data = await repository.workspace.get(args.where, user);
    return !isNil(data);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return true;
    }
    throw error;
  }
};

const workspaces = async (
  _: any,
  args: QueryWorkspacesArgs,
  { repository, user }: Context
): Promise<DbWorkspaceWithType[]> => {
  return await repository.workspace.list(
    { user, ...args.where },
    args.skip,
    args.first
  );
};

const createWorkspace = async (
  _: any,
  { data, options }: MutationCreateWorkspaceArgs,
  ctx: Context
): Promise<DbWorkspaceWithType> => {
  const { repository, user } = ctx;
  if (typeof user?.id !== "string") {
    throw new Error("Couldn't create workspace: No user id");
  }
  const db = await getPrismaClient();
  const userInDb = await db.user.findUnique({ where: { id: user.id } });
  if (userInDb == null) {
    throw new Error(
      `Couldn't create workspace: User with id "${user.id}" doesn't exist in the database`
    );
  }
  const createdWorkspaceId = await repository.workspace.add(
    {
      id: data.id ?? undefined,
      name: data.name,
      image: data.image ?? undefined,
      plan: data.plan,
    },
    user
  );
  const newWorkspace = await getWorkspace(
    { id: createdWorkspaceId },
    repository,
    user
  );
  if (options?.createTutorial) {
    await createTutorialDataset(newWorkspace.id, newWorkspace.slug, ctx);
  }
  return newWorkspace;
};

const updateWorkspace = async (
  _: any,
  args: MutationUpdateWorkspaceArgs,
  { repository, user }: Context
): Promise<DbWorkspaceWithType> => {
  // We need to get the id of the workspace, to keep track of it even if the slug changes
  const { id } = await getWorkspace(args.where, repository, user);
  await repository.workspace.update(
    castObjectNullsToUndefined(args.where),
    { ...args.data },
    user
  );
  return await getWorkspace({ id }, repository, user);
};

const deleteWorkspace = async (
  _: unknown,
  args: MutationDeleteWorkspaceArgs,
  { repository, user }: Context
) => {
  const { id } = await getWorkspace(args.where, repository, user);
  await repository.workspace.delete(args.where, user);
  const db = await getPrismaClient();
  const data = await db.workspace.findUnique({ where: { id } });
  foundWorkspace(data, args.where);
  return addTypename(data, "Workspace");
};

const memberships = async (parent: DbWorkspaceWithType) => {
  const db = await getPrismaClient();
  return (await db.membership.findMany({
    where: { workspaceSlug: parent.slug },
    orderBy: { createdAt: Prisma.SortOrder.asc },
    // needs to be casted to avoid conflicts between enums
  })) as Omit<
    Membership,
    "user" | "workspace" | "status" | "currentUserCanAcceptInvitation"
  >[];
};

const datasets = async (parent: DbWorkspaceWithType) => {
  const db = await getPrismaClient();
  const queryResult = await db.dataset.findMany({
    where: { workspaceSlug: parent.slug },
    orderBy: { createdAt: Prisma.SortOrder.asc },
  });
  return addTypenames(queryResult, "Dataset");
};

const stripeCustomerPortalUrl = async (
  parent: DbWorkspaceWithType,
  _args: any,
  { user, req }: Context
) => {
  if (!stripe.hasStripe) {
    return null;
  }

  const { stripeCustomerId, slug } = parent;

  if (user?.id == null) {
    throw new Error("User must be logged in to request this field");
  }

  if (stripeCustomerId == null) {
    throw new Error(
      `Couldn't retrieve Stripe Customer Portal Url of "${slug}" as this workspace doesn't have a Stripe Customer Id.`
    );
  }

  const db = await getPrismaClient();
  const membership = await db.membership.findUnique({
    where: { workspaceSlug_userId: { userId: user?.id, workspaceSlug: slug } },
  });

  if (membership?.role !== MembershipRole.Owner) {
    throw new Error(
      `User must have the role "Owner" of the workspace ${slug} to access billing information`
    );
  }

  // headers.origin will actually exist if defined
  const origin = (req?.headers as any).origin ?? "http://localhost:3000";
  const returnUrl = `${origin}/${slug}/settings`;
  return await stripe.createBillingPortalSession(stripeCustomerId, returnUrl);
};

export default {
  Query: {
    workspace,
    workspaces,
    workspaceExists,
  },
  Mutation: { createWorkspace, updateWorkspace, deleteWorkspace },
  Workspace: {
    memberships,
    datasets,
    stripeCustomerPortalUrl,
  },
};
