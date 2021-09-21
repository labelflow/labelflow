import {
  MutationCreateMembershipArgs,
  MutationDeleteMembershipArgs,
  MutationUpdateMembershipArgs,
  QueryMembershipArgs,
  QueryMembershipsArgs,
} from "@labelflow/graphql-types";
import { Prisma } from "@prisma/client";
import { prisma } from "../repository/prisma-client";

const membership = async (_: any, args: QueryMembershipArgs) => {
  const membershipFromDb = await prisma.membership.findUnique({
    where: { id: args.where.id },
  });

  if (membershipFromDb == null) {
    throw new Error(`Couldn't find a membership with id: "${args.where.id}"`);
  }

  return membershipFromDb;
};

const memberships = async (_: any, args: QueryMembershipsArgs) => {
  return await prisma.membership.findMany({
    orderBy: { createdAt: Prisma.SortOrder.asc },
    skip: args?.skip ?? undefined,
    take: args.first ?? undefined,
  });
};

const createMembership = async (_: any, args: MutationCreateMembershipArgs) => {
  return await prisma.membership.create({
    data: { ...args.data, id: args.data?.id ?? undefined },
  });
};

const updateMembership = async (_: any, args: MutationUpdateMembershipArgs) => {
  return await prisma.membership.update({
    where: args.where,
    data: { ...args.data, role: args.data?.role ?? undefined },
  });
};

const deleteMembership = async (_: any, args: MutationDeleteMembershipArgs) => {
  return await prisma.membership.delete({
    where: args.where,
  });
};

const user = async (
  parent: NonNullable<
    Prisma.PromiseReturnType<typeof prisma.membership.findUnique>
  >
) => {
  return await prisma.user.findUnique({
    where: { id: parent.userId },
  });
};

const workspace = async (
  parent: NonNullable<
    Prisma.PromiseReturnType<typeof prisma.membership.findUnique>
  >
) => {
  return await prisma.workspace.findUnique({
    where: { slug: parent.workspaceSlug },
  });
};

export default {
  Query: { membership, memberships },
  Mutation: { createMembership, updateMembership, deleteMembership },
  Membership: { user, workspace },
};
