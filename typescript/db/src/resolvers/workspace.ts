import { Prisma } from "@prisma/client";
import Stripe from "stripe";

import {
  QueryWorkspaceArgs,
  QueryWorkspacesArgs,
  Membership,
  MutationCreateWorkspaceArgs,
  MutationUpdateWorkspaceArgs,
  WorkspaceWhereUniqueInput,
  MembershipRole,
} from "@labelflow/graphql-types";

import {
  Context,
  DbWorkspaceWithType,
  forbiddenWorkspaceSlugs,
  isValidWorkspaceName,
  Repository,
} from "@labelflow/common-resolvers";
import slugify from "slugify";
import { getPrismaClient } from "../prisma-client";
import { castObjectNullsToUndefined } from "../repository/utils";

const stripe =
  process.env.STRIPE_SECRET_KEY && process.env.STRIPE_COMMUNITY_PLAN_PRICE_ID
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2020-08-27",
      })
    : null;

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
  await repository.workspace.list(
    { user, ...args.where },
    args.skip,
    args.first
  );

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

  const slug = slugify(args.data.name, { lower: true });

  if (slug.length <= 0) {
    throw new Error(`Cannot create a workspace with an empty name.`);
  }

  if (!isValidWorkspaceName(args.data.name)) {
    throw new Error(
      `Cannot create a workspace with the name "${args.data.name}". This name contains invalid characters.`
    );
  }

  if (forbiddenWorkspaceSlugs.includes(slug)) {
    throw new Error(
      `Cannot create a workspace with the slug "${slug}". This slug is reserved.`
    );
  }

  let stripeCustomerId;
  if (stripe) {
    const { id } = await stripe.customers.create({
      metadata: { slug, name: args.data.name },
      name: args.data.name,
    });

    stripeCustomerId = id;

    const freePlanPriceId = process.env.STRIPE_COMMUNITY_PLAN_PRICE_ID;

    await stripe.subscriptions.create({
      customer: id,
      metadata: { slug },
      items: [
        {
          price: freePlanPriceId,
          quantity: 1,
        },
      ],
    });
  }

  const createdWorkspaceId = await repository.workspace.add(
    {
      id: args.data.id ?? undefined,
      name: args.data.name,
      image: args.data.image ?? undefined,
      slug,
      stripeCustomerId,
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
  // We need to get the id of the workspace, to keep track of it even if the slug changes
  const currentWorkspace = await getWorkspace(args.where, repository, user);

  // Update workspace
  await repository.workspace.update(
    castObjectNullsToUndefined(args.where),
    { ...args.data },
    user
  );

  return await getWorkspace({ id: currentWorkspace.id }, repository, user);
};

const memberships = async (parent: DbWorkspaceWithType) => {
  return (await (
    await getPrismaClient()
  ).membership.findMany({
    where: { workspaceSlug: parent.slug },
    orderBy: { createdAt: Prisma.SortOrder.asc },
    // needs to be casted to avoid conflicts between enums
  })) as Omit<
    Membership,
    "user" | "workspace" | "status" | "currentUserCanAcceptInvitation"
  >[];
};

const datasets = async (parent: DbWorkspaceWithType) => {
  return await (
    await getPrismaClient()
  ).dataset.findMany({
    where: { workspaceSlug: parent.slug },
    orderBy: { createdAt: Prisma.SortOrder.asc },
  });
};

const stripeCustomerPortalUrl = async (
  parent: DbWorkspaceWithType,
  _args: any,
  { user, req }: Context
) => {
  if (!stripe) {
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

  const membership = await (
    await getPrismaClient()
  ).membership.findUnique({
    where: { workspaceSlug_userId: { userId: user?.id, workspaceSlug: slug } },
  });

  if (membership?.role !== MembershipRole.Owner) {
    throw new Error(
      `User must have the role "Owner" of the workspace ${slug} to access billing information`
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${
      // @ts-ignore ts says it doesn't exist but it does
      req?.headers.origin ?? "http://localhost:3000"
    }/${slug}/settings`,
  });

  return session.url;
};

export default {
  Query: {
    workspace,
    workspaces,
  },
  Mutation: { createWorkspace, updateWorkspace },
  Workspace: { memberships, datasets, stripeCustomerPortalUrl },
};
