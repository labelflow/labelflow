import { Context } from "@labelflow/common-resolvers";
import {
  CurrentUserCanAcceptInvitation,
  MembershipStatus,
  MutationAcceptInvitationArgs,
  MutationCreateMembershipArgs,
  MutationDeclineInvitationArgs,
  MutationDeleteMembershipArgs,
  MutationUpdateMembershipArgs,
  QueryMembershipArgs,
  QueryMembershipsArgs,
} from "@labelflow/graphql-types";
import { Prisma } from "@prisma/client";
import {
  checkUserAccessToMembership,
  checkUserAccessToWorkspace,
} from "../repository/access-control";
import { getPrismaClient, PrismaClient } from "../prisma-client";

const membership = async (
  _: any,
  args: QueryMembershipArgs
  // { user }: Context
) => {
  // See https://labelflow.slack.com/archives/C022PCC0H0W/p1635946220013100
  // await checkUserAccessToMembership({ where: args.where, user });
  const membershipFromDb = await (
    await getPrismaClient()
  ).membership.findUnique({
    where: { id: args.where.id },
  });

  if (membershipFromDb == null) {
    throw new Error(`Couldn't find a membership with id: "${args.where.id}"`);
  }

  return membershipFromDb;
};

const memberships = async (
  _: any,
  args: QueryMembershipsArgs,
  { user }: Context
) => {
  if (user?.id == null) {
    return [];
  }
  const workspaceSlug = args?.where?.workspaceSlug;
  if (workspaceSlug != null) {
    await checkUserAccessToWorkspace({ where: { slug: workspaceSlug }, user });
    return await (
      await getPrismaClient()
    ).membership.findMany({
      where: { workspaceSlug },
      orderBy: { createdAt: Prisma.SortOrder.asc },
      skip: args?.skip ?? undefined,
      take: args.first ?? undefined,
    });
  }
  return await (
    await getPrismaClient()
  ).membership.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: Prisma.SortOrder.asc },
    skip: args?.skip ?? undefined,
    take: args.first ?? undefined,
  });
};

const createMembership = async (
  _: any,
  args: MutationCreateMembershipArgs,
  { user }: Context
) => {
  await checkUserAccessToWorkspace({
    user,
    where: { slug: args.data.workspaceSlug },
  });
  return await (
    await getPrismaClient()
  ).membership.create({
    data: { ...args.data, id: args.data?.id ?? undefined },
  });
};

const updateMembership = async (
  _: any,
  args: MutationUpdateMembershipArgs,
  { user }: Context
) => {
  await checkUserAccessToMembership({ where: args.where, user });
  return await (
    await getPrismaClient()
  ).membership.update({
    where: args.where,
    data: { ...args.data, role: args.data?.role ?? undefined },
  });
};

const deleteMembership = async (
  _: any,
  args: MutationDeleteMembershipArgs,
  { user }: Context
) => {
  await checkUserAccessToMembership({ where: args.where, user });
  return await (
    await getPrismaClient()
  ).membership.delete({
    where: args.where,
  });
};

const acceptInvitation = async (
  _: any,
  args: MutationAcceptInvitationArgs,
  { user }: Context
) => {
  if (!user?.id) {
    throw new Error("User is not logged in");
  }
  const { id } = args.where;

  const prismaClient = await getPrismaClient();
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const membership = await prismaClient.membership.findUnique({
    where: { id },
  });

  if (!membership) {
    throw new Error("Couldn't find the membership you are trying to accept");
  }
  const { userId, declinedAt, workspaceSlug } = membership;

  if (userId) {
    throw new Error("This invitation was already accepted by a user");
  }

  if (declinedAt) {
    throw new Error("This invitation has already been declined");
  }

  const existingMembership = await prismaClient.membership.findUnique({
    where: {
      workspaceSlug_userId: {
        userId: user.id,
        workspaceSlug,
      },
    },
  });

  if (existingMembership) {
    throw new Error(
      "User cannot accept this invitation as they are already part of this workspace"
    );
  }

  return await prismaClient.membership.update({
    where: { id },
    data: { user: { connect: { id: user.id } } },
  });
};

const declineInvitation = async (
  _: any,
  args: MutationDeclineInvitationArgs,
  { user }: Context
) => {
  if (!user?.id) {
    throw new Error("User is not logged in");
  }
  const { id } = args.where;

  const prismaClient = await getPrismaClient();
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const membership = await prismaClient.membership.findUnique({
    where: { id },
  });

  if (!membership) {
    throw new Error("Couldn't find the membership you are trying to accept");
  }
  const { userId, declinedAt } = membership;

  if (userId) {
    throw new Error("This invitation was already accepted by a user");
  }

  if (declinedAt) {
    throw new Error("This invitation has already been declined");
  }

  return await prismaClient.membership.update({
    where: { id },
    data: { declinedAt: new Date() },
  });
};

const user = async (
  parent: NonNullable<
    Prisma.PromiseReturnType<PrismaClient["membership"]["findUnique"]>
  >
) => {
  if (!parent.userId) return null;
  return await (
    await getPrismaClient()
  ).user.findUnique({
    where: { id: parent.userId },
  });
};

const workspace = async (
  parent: NonNullable<
    Prisma.PromiseReturnType<PrismaClient["membership"]["findUnique"]>
  >
) => {
  return await (
    await getPrismaClient()
  ).workspace.findUnique({
    where: { slug: parent.workspaceSlug },
  });
};

const status = async (
  {
    userId,
    declinedAt,
  }: NonNullable<
    Prisma.PromiseReturnType<PrismaClient["membership"]["findUnique"]>
  >,
  args: any,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  { user }: Context
) => {
  if (!user?.id) {
    throw new Error("User is not logged in");
  }

  if (declinedAt) {
    return MembershipStatus.Declined;
  }

  if (!userId) {
    return MembershipStatus.Sent;
  }

  return MembershipStatus.Active;
};

const currentUserCanAcceptInvitation = async (
  {
    userId,
    declinedAt,
    workspaceSlug,
  }: NonNullable<
    Prisma.PromiseReturnType<PrismaClient["membership"]["findUnique"]>
  >,
  args: any,
  // eslint-disable-next-line @typescript-eslint/no-shadow
  { user }: Context
) => {
  if (!user?.id) {
    throw new Error("User is not logged in");
  }

  if (userId) {
    return CurrentUserCanAcceptInvitation.AlreadyAccepted;
  }

  if (declinedAt) {
    return CurrentUserCanAcceptInvitation.AlreadyDeclined;
  }

  const existingMembership = await (
    await getPrismaClient()
  ).membership.findUnique({
    where: { workspaceSlug_userId: { userId: user.id, workspaceSlug } },
  });

  if (existingMembership) {
    return CurrentUserCanAcceptInvitation.AlreadyMemberOfTheWorkspace;
  }

  return CurrentUserCanAcceptInvitation.Yes;
};

export default {
  Query: { membership, memberships },
  Mutation: {
    createMembership,
    updateMembership,
    deleteMembership,
    acceptInvitation,
    declineInvitation,
  },
  Membership: { user, workspace, status, currentUserCanAcceptInvitation },
};
