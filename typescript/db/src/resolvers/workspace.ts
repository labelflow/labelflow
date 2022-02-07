import {
  Context,
  DbWorkspace,
  DbWorkspaceWithType,
  Repository,
  addTypename,
  addTypenames,
} from "@labelflow/common-resolvers";
import {
  tutorialImages,
  tutorialLabelClass,
  tutorialLabels,
} from "@labelflow/common-resolvers/src/data/dataset-tutorial";
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
import { isNil, omit } from "lodash/fp";
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

type CreateTutorialDatasetOptions = Context & {
  createdWorkspaceId: string;
};

const createTutorialDatasetInWorkspace = async ({
  repository,
  req,
  user,
  createdWorkspaceId,
}: CreateTutorialDatasetOptions) => {
  const now = new Date();
  const createdWorkspace = await repository.workspace.get(
    { id: createdWorkspaceId },
    user
  );
  const imagesToCreate = tutorialImages.map(
    ({ name, url, width, height, mimeType }, urlIndex) => {
      const createdAt = new Date(now.getTime() + urlIndex);
      return {
        externalUrl: url,
        name,
        createdAt: createdAt.toISOString(),
        noThumbnails: true,
        width,
        height,
        mimeType,
      };
    }
  );
  const labels = tutorialLabels.map((label) => ({
    ...omit(["id", "imageId"], label),
  }));
  const labelClass = tutorialLabelClass;
  await createTutorialDataset(
    null,
    {
      name: "Tutorial",
      workspaceSlug: createdWorkspace?.slug ?? "",
      images: imagesToCreate,
      labelClass,
      labels,
    },
    { repository, req, user }
  );
};

const createWorkspace = async (
  _: any,
  args: MutationCreateWorkspaceArgs,
  { repository, user, req }: Context
): Promise<DbWorkspaceWithType> => {
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
      id: args.data.id ?? undefined,
      name: args.data.name,
      image: args.data.image ?? undefined,
    },
    user
  );
  if (createdWorkspaceId) {
    await createTutorialDatasetInWorkspace({
      repository,
      user,
      req,
      createdWorkspaceId,
    });
  }

  return await getWorkspace({ id: createdWorkspaceId }, repository, user);
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
  Workspace: { memberships, datasets, stripeCustomerPortalUrl },
};
